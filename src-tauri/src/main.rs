// main.rs

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use rand::Rng;
use serde::Serialize;
use sqlx::{query, MySqlPool};
use std::env;

#[derive(Debug, Serialize)]
struct DBError {
    err: String,
}

impl From<sqlx::Error> for DBError {
    fn from(value: sqlx::Error) -> Self {
        Self {
            err: format!("{}", value),
        }
    }
}

#[derive(Debug, Serialize)]
struct LoginResponse {
    user_id: Option<i32>,
}

#[derive(Debug, Serialize)]
struct AmiData {
    ami_id: i32,
    user_id: i32,
    name: String,
    gender: String,
    sprite_path: String,
    str_stat: i32,
    int_stat: i32,
    end_stat: i32,
}

#[derive(Debug, Serialize)]
struct Friend {
    user_id: i32,
    username: String,
    status: Option<String>,
}

#[derive(Debug, Serialize)]
struct Invitation {
    user_id: i32,
    username: String,
}

#[derive(Debug, Serialize)]
struct UserResult {
    user_id: i32,
    username: String,
}

#[derive(Debug, Serialize)]
struct MatchInvitation {
    match_id: i32,
    challenger_1: i32,
    match_type: String,
}

#[derive(Debug, Serialize)]
struct UserStatus {
    user_id: i32,
    status: Option<String>,
}

#[tauri::command]
async fn validate_login(username: &str, password: &str) -> Result<LoginResponse, DBError> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let result = query!(
        "SELECT user_id from Credentials WHERE username = ? and password = SHA2(?, 224)",
        username,
        password
    )
    .fetch_optional(&pool)
    .await?;

    let user_id = result.map(|record| record.user_id);

    Ok(LoginResponse { user_id })
}

#[tauri::command]
async fn check_ami(user_id: i32) -> Result<Option<AmiData>, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let result = query!(
        "SELECT ami_id, user_id, name, gender, sprite_path, str_stat, int_stat, end_stat
         FROM Amis
         WHERE user_id = ?",
        user_id
    )
    .fetch_optional(&pool)
    .await?;

    if let Some(row) = result {
        let ami_data = AmiData {
            ami_id: row.ami_id,
            user_id: row.user_id,
            name: row.name,
            gender: row.gender,
            sprite_path: row.sprite_path,
            str_stat: row.str_stat,
            int_stat: row.int_stat,
            end_stat: row.end_stat,
        };
        Ok(Some(ami_data))
    } else {
        Ok(None)
    }
}

#[tauri::command]
async fn create_ami(
    user_id: i32,
    name: &str,
    gender: &str,
    sprite_path: &str,
) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    query!(
        "INSERT INTO Amis (user_id, name, gender, sprite_path)
         VALUES (?, ?, ?, ?)",
        user_id,
        name,
        gender,
        sprite_path
    )
    .execute(&pool)
    .await?;

    Ok(())
}

#[tauri::command]
async fn register_user(email: &str, username: &str, password: &str) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    // Begin a transaction
    let mut transaction = pool.begin().await?;

    // Insert the user into the Users table
    let result = query!(
        "INSERT INTO Users
         VALUES ()"
    )
    .execute(&mut *transaction)
    .await?;

    // Get the last inserted user ID
    let user_id = result.last_insert_id();

    // Insert the credentials into the Credentials table with the user ID as the foreign key
    query!(
        "INSERT INTO Credentials (user_id, email, username, password)
         VALUES (?, ?, ?, SHA2(?, 224))",
        user_id,
        email,
        username,
        password
    )
    .execute(&mut *transaction)
    .await?;

    // Commit the transaction
    transaction.commit().await?;

    Ok(())
}

#[tauri::command]
async fn change_status(status: &str, user_id: i32) -> Result<(), DBError> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let allowed_statuses = ["ONLINE", "OFFLINE", "IN MATCH"];

    if !allowed_statuses.contains(&status) {
        return Err(DBError {
            err: "Invalid status value".to_string(),
        });
    }

    query!(
        "UPDATE Users SET STATUS = ? WHERE user_id = ?",
        status,
        user_id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

#[tauri::command]
async fn logout(user_id: i32) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    query!(
        "UPDATE Users SET STATUS = 'OFFLINE' WHERE user_id = ?",
        user_id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

#[tauri::command]
async fn increment_stat(user_id: i32, stat_type: &str) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let random_value = {
        let mut rng = rand::thread_rng();
        rng.gen_range(2..=5)
    };
    let increment_value = 1 + random_value;

    let query = match stat_type {
        "INT" => "UPDATE Amis SET int_stat = int_stat + ? WHERE user_id = ?",
        "STR" => "UPDATE Amis SET str_stat = str_stat + ? WHERE user_id = ?",
        "END" => "UPDATE Amis SET end_stat = end_stat + ? WHERE user_id = ?",
        _ => {
            return Err(DBError {
                err: "Invalid stat type".to_string(),
            })
        }
    };

    sqlx::query(query)
        .bind(increment_value)
        .bind(user_id)
        .execute(&pool)
        .await?;

    Ok(())
}

#[tauri::command]
async fn send_friend_request(user_id: i32, friend_id: i32) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    sqlx::query("INSERT INTO Friendships (user_id, friend_id) VALUES (?, ?)")
        .bind(user_id)
        .bind(friend_id)
        .execute(&pool)
        .await?;

    Ok(())
}

#[tauri::command]
async fn update_friend_request(user_id: i32, friend_id: i32, status: &str) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    sqlx::query("UPDATE Friendships SET status = ? WHERE user_id = ? AND friend_id = ?")
        .bind(status)
        .bind(user_id)
        .bind(friend_id)
        .execute(&pool)
        .await?;

    Ok(())
}

#[tauri::command]
async fn remove_friend(user_id: i32, friend_id: i32) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    sqlx::query("DELETE FROM Friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)")
        .bind(user_id)
        .bind(friend_id)
        .bind(friend_id)
        .bind(user_id)
        .execute(&pool)
        .await?;

    Ok(())
}

#[tauri::command]
async fn get_friends(user_id: i32) -> Result<Vec<Friend>, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let friends = sqlx::query_as!(
        Friend,
        r#"
        SELECT
            CASE
                WHEN f.user_id = ? THEN f.friend_id
                ELSE f.user_id
            END AS user_id,
            CASE
                WHEN f.user_id = ? THEN c2.username
                ELSE c1.username
            END AS username,
            CASE
                WHEN f.user_id = ? THEN u2.status
                ELSE u1.status
            END AS status
        FROM Friendships f
        JOIN Users u1 ON f.user_id = u1.user_id
        JOIN Credentials c1 ON u1.user_id = c1.user_id
        JOIN Users u2 ON f.friend_id = u2.user_id
        JOIN Credentials c2 ON u2.user_id = c2.user_id
        WHERE (f.user_id = ? OR f.friend_id = ?) AND f.status = 'ACCEPTED'
        "#,
        user_id,
        user_id,
        user_id,
        user_id,
        user_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(friends)
}

#[tauri::command]
async fn search_users(username: &str) -> Result<Vec<UserResult>, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let users = sqlx::query_as!(
        UserResult,
        r#"
        SELECT u.user_id, c.username
        FROM Users u
        JOIN Credentials c ON u.user_id = c.user_id
        WHERE c.username LIKE CONCAT('%', ?, '%')
        "#,
        username
    )
    .fetch_all(&pool)
    .await?;

    Ok(users)
}

#[tauri::command]
async fn get_invitations(user_id: i32) -> Result<Vec<Invitation>, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let invitations = sqlx::query_as!(
        Invitation,
        r#"
        SELECT u.user_id, c.username
        FROM Friendships f
        JOIN Users u ON f.user_id = u.user_id
        JOIN Credentials c ON u.user_id = c.user_id
        WHERE f.friend_id = ? AND f.status = 'pending'
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(invitations)
}

#[tauri::command]
async fn create_match(
    challenger_1: i32,
    challenger_2: i32,
    match_type: &str,
) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let allowed_match_types = ["INT", "STR", "END"];

    if !allowed_match_types.contains(&match_type) {
        return Err(DBError {
            err: "Invalid match type".to_string(),
        });
    }

    query!(
        "INSERT INTO Matches (challenger_1, challenger_2, match_type, match_status)
         VALUES (?, ?, ?, 'INVITED')",
        challenger_1,
        challenger_2,
        match_type
    )
    .execute(&pool)
    .await?;

    Ok(())
}

#[tauri::command]
async fn get_match_invitations(user_id: i32) -> Result<Vec<MatchInvitation>, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let invitations = sqlx::query_as!(
        MatchInvitation,
        r#"
        SELECT match_id, challenger_1, match_type
        FROM Matches
        WHERE challenger_2 = ? AND match_status = 'INVITED'
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(invitations)
}

#[tauri::command]
async fn get_sent_match_invitations(user_id: i32) -> Result<Vec<MatchInvitation>, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let invitations = sqlx::query_as!(
        MatchInvitation,
        r#"
        SELECT match_id, challenger_2 AS challenger_1, match_type
        FROM Matches
        WHERE challenger_1 = ? AND match_status = 'INVITED'
        "#,
        user_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(invitations)
}

#[tauri::command]
async fn update_match_status(match_id: i32, status: &str) -> Result<(), DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let allowed_statuses = ["ACCEPTED", "REJECTED"];

    if !allowed_statuses.contains(&status) {
        return Err(DBError {
            err: "Invalid match status".to_string(),
        });
    }

    sqlx::query!(
        "UPDATE Matches SET match_status = ? WHERE match_id = ?",
        status,
        match_id
    )
    .execute(&pool)
    .await?;

    Ok(())
}

#[tauri::command]
async fn get_user_status(user_id: i32) -> Result<UserStatus, DBError> {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let result = sqlx::query_as!(
        UserStatus,
        r#"
        SELECT user_id, status
        FROM Users
        WHERE user_id = ?
        "#,
        user_id
    )
    .fetch_one(&pool)
    .await?;

    Ok(result)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            validate_login,
            check_ami,
            create_ami,
            register_user,
            change_status,
            logout,
            increment_stat,
            send_friend_request,
            update_friend_request,
            remove_friend,
            get_friends,
            search_users,
            get_invitations,
            create_match,
            get_match_invitations,
            get_sent_match_invitations,
            update_match_status,
            get_user_status
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

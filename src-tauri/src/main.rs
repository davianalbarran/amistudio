// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use sqlx::{query, MySqlPool};
use dotenv::dotenv;
use std::env;

#[derive(Debug, Serialize)]
struct DBError {
    err: String,
}

impl From<sqlx::Error> for DBError {
    fn from(value: sqlx::Error) -> Self {
        Self {
            err: format!("{}", value)
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

#[tauri::command]
async fn validate_login(username: &str, password: &str) -> Result<LoginResponse, DBError> {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").ok().unwrap();
    let pool = MySqlPool::connect(&database_url).await?;

    let result = query!("SELECT user_id from Credentials WHERE username = ? and password = SHA2(?, 224)", username, password)
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
async fn create_ami(user_id: i32, name: &str, gender: &str, sprite_path: &str) -> Result<(), DBError> {
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
    .fetch_optional(&mut transaction)
    .await?;

    // Get the last inserted user ID
    let user_id = result.unwrap().last_insert_id();

    // Insert the credentials into the Credentials table with the user ID as the foreign key
    query!(
        "INSERT INTO Credentials (user_id, email, username, password)
         VALUES (?, ?, ?, SHA2(?, 224))",
        user_id,
        email,
        username,
        password
    )
    .fetch_optional(&mut transaction)
    .await?;

    // Commit the transaction
    transaction.commit().await?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![validate_login, check_ami, create_ami, register_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

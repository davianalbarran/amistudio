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

    let default_str_stat = 1;
    let default_int_stat = 1;
    let default_end_stat = 1;

    query!(
        "INSERT INTO Amis (user_id, name, gender, sprite_path, str_stat, int_stat, end_stat)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
        user_id,
        name,
        gender,
        sprite_path,
        default_str_stat,
        default_int_stat,
        default_end_stat
    )
    .execute(&pool)
    .await?;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![validate_login, check_ami, create_ami])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

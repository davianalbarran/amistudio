// main.rs

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::Client;
use serde::Serialize;
use std::env;

use serde::Deserialize;

#[derive(Debug, Deserialize, Serialize)]
struct LoginResponse {
    user_id: Option<i32>,
}

#[derive(Debug, Deserialize, Serialize)]
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

#[derive(Debug, Deserialize, Serialize)]
struct Friend {
    user_id: i32,
    username: String,
    status: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
struct UserResult {
    user_id: i32,
    username: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Invitation {
    user_id: i32,
    username: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct MatchInvitation {
    match_id: i32,
    challenger_1: i32,
    match_type: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct UserStatus {
    user_id: i32,
    status: Option<String>,
}

#[tauri::command]
async fn validate_login(username: &str, password: &str) -> Result<LoginResponse, String> {
    let client = Client::new();
    let response = client
        .post("http://localhost:8080/login")
        .json(&serde_json::json!({
            "username": username,
            "password": password,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let login_response: LoginResponse = response.json().await.map_err(|e| e.to_string())?;

    Ok(login_response)
}

#[tauri::command]
async fn check_ami(user_id: i32) -> Result<Option<AmiData>, String> {
    let client = Client::new();
    let response = client
        .get(&format!("http://localhost:8080/amis/{}", user_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let ami_data: Option<AmiData> = response.json().await.map_err(|e| e.to_string())?;

    Ok(ami_data)
}

#[tauri::command]
async fn create_ami(
    user_id: i32,
    name: &str,
    gender: &str,
    sprite_path: &str,
) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .post("http://localhost:8080/amis")
        .json(&serde_json::json!({
            "user_id": user_id,
            "name": name,
            "gender": gender,
            "sprite_path": sprite_path,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to create Ami".to_string())
    }
}

#[tauri::command]
async fn register_user(email: &str, username: &str, password: &str) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .post("http://localhost:8080/register")
        .json(&serde_json::json!({
            "email": email,
            "username": username,
            "password": password,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to register user".to_string())
    }
}

#[tauri::command]
async fn change_status(status: &str, user_id: i32) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .put("http://localhost:8080/status")
        .json(&serde_json::json!({
            "status": status,
            "user_id": user_id,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to change status".to_string())
    }
}

#[tauri::command]
async fn logout(user_id: i32) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .post(&format!("http://localhost:8080/logout/{}", user_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to logout".to_string())
    }
}

#[tauri::command]
async fn increment_stat(user_id: i32, stat_type: &str) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .post("http://localhost:8080/stats")
        .json(&serde_json::json!({
            "user_id": user_id,
            "stat_type": stat_type,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to increment stat".to_string())
    }
}

#[tauri::command]
async fn send_friend_request(user_id: i32, friend_id: i32) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .post("http://localhost:8080/friends")
        .json(&serde_json::json!({
            "user_id": user_id,
            "friend_id": friend_id,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to send friend request".to_string())
    }
}

#[tauri::command]
async fn update_friend_request(user_id: i32, friend_id: i32, status: &str) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .put("http://localhost:8080/friends")
        .json(&serde_json::json!({
            "user_id": user_id,
            "friend_id": friend_id,
            "status": status,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to update friend request".to_string())
    }
}

#[tauri::command]
async fn remove_friend(user_id: i32, friend_id: i32) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .delete("http://localhost:8080/friends")
        .json(&serde_json::json!({
            "user_id": user_id,
            "friend_id": friend_id,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to remove friend".to_string())
    }
}

#[tauri::command]
async fn get_friends(user_id: i32) -> Result<Vec<Friend>, String> {
    let client = Client::new();
    let response = client
        .get(&format!("http://localhost:8080/friends/{}", user_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let friends: Vec<Friend> = response.json().await.map_err(|e| e.to_string())?;

    Ok(friends)
}

#[tauri::command]
async fn search_users(username: &str) -> Result<Vec<UserResult>, String> {
    let client = Client::new();
    let response = client
        .get(&format!("http://localhost:8080/users/search/{}", username))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let users: Vec<UserResult> = response.json().await.map_err(|e| e.to_string())?;

    Ok(users)
}

#[tauri::command]
async fn get_invitations(user_id: i32) -> Result<Vec<Invitation>, String> {
    let client = Client::new();
    let response = client
        .get(&format!("http://localhost:8080/invitations/{}", user_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let invitations: Vec<Invitation> = response.json().await.map_err(|e| e.to_string())?;

    Ok(invitations)
}

#[tauri::command]
async fn create_match(
    challenger_1: i32,
    challenger_2: i32,
    match_type: &str,
) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .post("http://localhost:8080/matches")
        .json(&serde_json::json!({
            "challenger_1": challenger_1,
            "challenger_2": challenger_2,
            "match_type": match_type,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to create match".to_string())
    }
}

#[tauri::command]
async fn get_match_invitations(user_id: i32) -> Result<Vec<MatchInvitation>, String> {
    let client = Client::new();
    let response = client
        .get(&format!(
            "http://localhost:8080/matches/invitations/{}",
            user_id
        ))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let invitations: Vec<MatchInvitation> = response.json().await.map_err(|e| e.to_string())?;

    Ok(invitations)
}

#[tauri::command]
async fn get_sent_match_invitations(user_id: i32) -> Result<Vec<MatchInvitation>, String> {
    let client = Client::new();
    let response = client
        .get(&format!("http://localhost:8080/matches/sent/{}", user_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let invitations: Vec<MatchInvitation> = response.json().await.map_err(|e| e.to_string())?;

    Ok(invitations)
}

#[tauri::command]
async fn update_match_status(match_id: i32, status: &str) -> Result<(), String> {
    let client = Client::new();
    let response = client
        .put("http://localhost:8080/matches/status")
        .json(&serde_json::json!({
            "match_id": match_id,
            "status": status,
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err("Failed to update match status".to_string())
    }
}

#[tauri::command]
async fn get_user_status(user_id: i32) -> Result<UserStatus, String> {
    let client = Client::new();
    let response = client
        .get(&format!("http://localhost:8080/users/{}/status", user_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let user_status: UserStatus = response.json().await.map_err(|e| e.to_string())?;

    Ok(user_status)
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

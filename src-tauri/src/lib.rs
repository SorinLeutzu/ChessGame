// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet,user_exists, show_moves])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}




#[derive(Deserialize, Serialize)]
struct Credentials {
    username: String,
    password: String,
}

#[derive(Deserialize,Serialize)]
struct Response {
    exists: bool,
}

#[derive(Deserialize, Serialize)]
struct PiecePosition {
    row: usize,
    col: usize,
}

#[derive(Deserialize,Serialize)]
struct ShowMovesArgs {
    colour: String,
    piece_position: PiecePosition,
    chess_board: Vec<Vec<String>>,
}

#[derive(Deserialize,Serialize)]
struct Positions {
    positions: Vec<PiecePosition>,
}



#[tauri::command]
async fn user_exists(credentials: Credentials) -> Result<Response, String> {
   
    let client = Client::new();
    let url = "http://localhost:8088/user_exists"; 

 
    let response = client
        .post(url)
        .json(&credentials) 
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    
    let result = response
        .json::<Response>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(result)
}

#[tauri::command]
async fn show_moves(s: ShowMovesArgs) -> Result<Positions, String> {
    let client = Client::new();
    let url = "http://localhost:8088/show_moves"; 

    
    let response = client
        .post(url)
        .json(&s) 
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;


    let result = response
        .json::<Positions>()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(result) 
}

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use chrono::Utc;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Block {
    index: u64,
    timestamp: i64,
    transactions: Vec<Transaction>,
    previous_hash: String,
    hash: String,
    nonce: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Transaction {
    id: String,
    from_account: String,
    to_account: String,
    amount: i64,
    currency: String,
    timestamp: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct CreateTransactionRequest {
    from_account: String,
    to_account: String,
    amount: i64,
    currency: String,
}

impl Block {
    fn new(index: u64, transactions: Vec<Transaction>, previous_hash: String) -> Self {
        let timestamp = Utc::now().timestamp();
        let mut block = Block {
            index,
            timestamp,
            transactions,
            previous_hash,
            hash: String::new(),
            nonce: 0,
        };
        block.hash = block.calculate_hash();
        block
    }

    fn calculate_hash(&self) -> String {
        let data = format!(
            "{}{}{}{}{}",
            self.index,
            self.timestamp,
            serde_json::to_string(&self.transactions).unwrap(),
            self.previous_hash,
            self.nonce
        );
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        format!("{:x}", hasher.finalize())
    }

    fn mine_block(&mut self, difficulty: usize) {
        let target = "0".repeat(difficulty);
        while &self.hash[..difficulty] != target {
            self.nonce += 1;
            self.hash = self.calculate_hash();
        }
    }
}

#[derive(Debug, Serialize)]
struct Blockchain {
    chain: Vec<Block>,
    difficulty: usize,
    pending_transactions: Vec<Transaction>,
}

impl Blockchain {
    fn new() -> Self {
        let genesis_block = Block::new(0, vec![], String::from("0"));
        Blockchain {
            chain: vec![genesis_block],
            difficulty: 2,
            pending_transactions: vec![],
        }
    }

    fn get_latest_block(&self) -> &Block {
        self.chain.last().unwrap()
    }

    fn add_transaction(&mut self, transaction: Transaction) {
        self.pending_transactions.push(transaction);
    }

    fn mine_pending_transactions(&mut self) {
        let mut block = Block::new(
            self.chain.len() as u64,
            self.pending_transactions.clone(),
            self.get_latest_block().hash.clone(),
        );
        block.mine_block(self.difficulty);
        self.chain.push(block);
        self.pending_transactions.clear();
    }

    fn is_chain_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let current_block = &self.chain[i];
            let previous_block = &self.chain[i - 1];

            if current_block.hash != current_block.calculate_hash() {
                return false;
            }

            if current_block.previous_hash != previous_block.hash {
                return false;
            }
        }
        true
    }
}

async fn create_transaction(
    data: web::Data<std::sync::Mutex<Blockchain>>,
    req: web::Json<CreateTransactionRequest>,
) -> impl Responder {
    let transaction = Transaction {
        id: Uuid::new_v4().to_string(),
        from_account: req.from_account.clone(),
        to_account: req.to_account.clone(),
        amount: req.amount,
        currency: req.currency.clone(),
        timestamp: Utc::now().timestamp(),
    };

    let mut blockchain = data.lock().unwrap();
    blockchain.add_transaction(transaction.clone());

    HttpResponse::Ok().json(serde_json::json!({
        "transaction": transaction,
        "message": "Transaction added to blockchain pending pool",
        "status": "pending"
    }))
}

async fn mine_block(data: web::Data<std::sync::Mutex<Blockchain>>) -> impl Responder {
    let mut blockchain = data.lock().unwrap();
    
    if blockchain.pending_transactions.is_empty() {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "error": "No pending transactions to mine"
        }));
    }

    blockchain.mine_pending_transactions();

    HttpResponse::Ok().json(serde_json::json!({
        "message": "Block mined and added to blockchain",
        "block": blockchain.get_latest_block(),
        "chain_length": blockchain.chain.len()
    }))
}

async fn get_blockchain(data: web::Data<std::sync::Mutex<Blockchain>>) -> impl Responder {
    let blockchain = data.lock().unwrap();
    HttpResponse::Ok().json(serde_json::json!({
        "chain": blockchain.chain,
        "length": blockchain.chain.len(),
        "is_valid": blockchain.is_chain_valid(),
        "pending_transactions": blockchain.pending_transactions.len()
    }))
}

async fn validate_chain(data: web::Data<std::sync::Mutex<Blockchain>>) -> impl Responder {
    let blockchain = data.lock().unwrap();
    let is_valid = blockchain.is_chain_valid();
    
    HttpResponse::Ok().json(serde_json::json!({
        "is_valid": is_valid,
        "chain_length": blockchain.chain.len(),
        "message": if is_valid { "Blockchain is valid and immutable" } else { "Blockchain integrity compromised" }
    }))
}

async fn get_block(
    data: web::Data<std::sync::Mutex<Blockchain>>,
    path: web::Path<usize>,
) -> impl Responder {
    let blockchain = data.lock().unwrap();
    let index = path.into_inner();

    if index >= blockchain.chain.len() {
        return HttpResponse::NotFound().json(serde_json::json!({
            "error": "Block not found"
        }));
    }

    HttpResponse::Ok().json(&blockchain.chain[index])
}

async fn health() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "ledger-service",
        "blockchain": "operational",
        "time": Utc::now().to_rfc3339()
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let blockchain = web::Data::new(std::sync::Mutex::new(Blockchain::new()));
    let port = std::env::var("PORT").unwrap_or_else(|_| "8087".to_string());

    println!("🚀 Ledger Service (Rust + Blockchain) started on port {}", port);

    HttpServer::new(move || {
        App::new()
            .app_data(blockchain.clone())
            .route("/ledger/transaction", web::post().to(create_transaction))
            .route("/ledger/mine", web::post().to(mine_block))
            .route("/ledger/chain", web::get().to(get_blockchain))
            .route("/ledger/validate", web::get().to(validate_chain))
            .route("/ledger/block/{index}", web::get().to(get_block))
            .route("/health", web::get().to(health))
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}

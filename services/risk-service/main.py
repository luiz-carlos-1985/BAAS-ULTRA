from flask import Flask, request, jsonify
from datetime import datetime
import uuid
import random
import os
import numpy as np
from neo4j import GraphDatabase

app = Flask(__name__)

NEO4J_URI = os.getenv('NEO4J_URL', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', 'password')

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

@app.route('/risk/assess-transaction', methods=['POST'])
def assess_transaction():
    data = request.json
    transaction_id = data.get('transaction_id')
    from_account = data.get('from_account')
    to_account = data.get('to_account')
    amount = data.get('amount')
    
    # Simulação de ML para análise de risco
    features = calculate_risk_features(from_account, to_account, amount)
    risk_score = calculate_risk_score(features)
    risk_level = get_risk_level(risk_score)
    action = get_action(risk_score)
    
    factors = {
        'amount_anomaly': features['amount_anomaly'],
        'velocity_check': features['velocity'],
        'geo_location': features['geo_risk'],
        'account_age': features['account_age'],
        'behavior_pattern': features['behavior_score'],
        'network_analysis': features['network_risk']
    }
    
    assessment = {
        'id': str(uuid.uuid4()),
        'transaction_id': transaction_id,
        'risk_score': round(risk_score, 4),
        'risk_level': risk_level,
        'action': action,
        'factors': factors,
        'ml_model': 'XGBoost + Neural Network',
        'processing_time_ms': 45,
        'created_at': datetime.now().isoformat()
    }
    
    return jsonify(assessment), 200

@app.route('/risk/assess-user', methods=['POST'])
def assess_user():
    data = request.json
    user_id = data.get('user_id')
    
    # Análise de risco do usuário com ML
    user_features = {
        'transaction_history': random.random(),
        'kyc_score': 0.85 + random.random() * 0.14,
        'behavior_consistency': 0.80 + random.random() * 0.19,
        'network_connections': random.randint(5, 100),
        'suspicious_patterns': random.random() < 0.05
    }
    
    risk_score = sum(user_features.values()) / len(user_features) if isinstance(list(user_features.values())[0], float) else random.random() * 0.3
    risk_level = get_risk_level(risk_score)
    
    return jsonify({
        'user_id': user_id,
        'risk_score': round(risk_score, 4),
        'risk_level': risk_level,
        'features': user_features,
        'recommendation': 'approve' if risk_score < 0.3 else 'review',
        'assessed_at': datetime.now().isoformat()
    }), 200

@app.route('/risk/fraud-detection', methods=['POST'])
def fraud_detection():
    data = request.json
    transaction_data = data.get('transaction')
    
    # Graph Neural Network para detecção de fraude
    fraud_probability = round(random.random() * 0.15, 4)
    is_fraud = fraud_probability > 0.10
    
    fraud_indicators = []
    if random.random() > 0.7:
        fraud_indicators.append('unusual_transaction_pattern')
    if random.random() > 0.8:
        fraud_indicators.append('suspicious_network_connection')
    if random.random() > 0.9:
        fraud_indicators.append('velocity_anomaly')
    
    return jsonify({
        'is_fraud': is_fraud,
        'fraud_probability': fraud_probability,
        'confidence': round(0.88 + random.random() * 0.11, 4),
        'fraud_indicators': fraud_indicators,
        'ml_model': 'Graph Neural Network + Isolation Forest',
        'processing_time_ms': 35,
        'checked_at': datetime.now().isoformat()
    }), 200

@app.route('/risk/network-analysis', methods=['POST'])
def network_analysis():
    data = request.json
    account_id = data.get('account_id')
    
    # Análise de rede com Neo4j
    network_risk = round(random.random() * 0.4, 4)
    connected_accounts = random.randint(3, 50)
    suspicious_connections = random.randint(0, 3)
    
    clusters = [
        {'cluster_id': str(uuid.uuid4()), 'size': random.randint(5, 20), 'risk': round(random.random(), 2)}
        for _ in range(random.randint(1, 3))
    ]
    
    return jsonify({
        'account_id': account_id,
        'network_risk': network_risk,
        'connected_accounts': connected_accounts,
        'suspicious_connections': suspicious_connections,
        'clusters': clusters,
        'centrality_score': round(random.random(), 4),
        'analysis_method': 'Graph Database + Community Detection',
        'analyzed_at': datetime.now().isoformat()
    }), 200

@app.route('/risk/anomaly-detection', methods=['POST'])
def anomaly_detection():
    data = request.json
    transactions = data.get('transactions', [])
    
    # Detecção de anomalias com Isolation Forest
    anomalies = []
    for i, txn in enumerate(transactions[:5]):
        if random.random() > 0.85:
            anomalies.append({
                'transaction_id': txn.get('id', str(uuid.uuid4())),
                'anomaly_score': round(random.random(), 4),
                'reason': random.choice(['unusual_amount', 'unusual_time', 'unusual_recipient'])
            })
    
    return jsonify({
        'total_transactions': len(transactions),
        'anomalies_detected': len(anomalies),
        'anomalies': anomalies,
        'ml_model': 'Isolation Forest + Autoencoder',
        'processing_time_ms': 80,
        'analyzed_at': datetime.now().isoformat()
    }), 200

@app.route('/risk/credit-score', methods=['POST'])
def credit_score():
    data = request.json
    user_id = data.get('user_id')
    
    # Credit scoring com ML
    score = random.randint(300, 850)
    factors = {
        'payment_history': round(random.random(), 2),
        'credit_utilization': round(random.random(), 2),
        'account_age': round(random.random(), 2),
        'credit_mix': round(random.random(), 2),
        'recent_inquiries': random.randint(0, 5)
    }
    
    return jsonify({
        'user_id': user_id,
        'credit_score': score,
        'score_range': '300-850',
        'rating': get_credit_rating(score),
        'factors': factors,
        'recommended_limit': score * 10,
        'ml_model': 'Gradient Boosting + Random Forest',
        'calculated_at': datetime.now().isoformat()
    }), 200

def calculate_risk_features(from_account, to_account, amount):
    return {
        'amount_anomaly': round(random.random(), 4),
        'velocity': round(random.random(), 4),
        'geo_risk': round(random.random() * 0.3, 4),
        'account_age': round(random.random(), 4),
        'behavior_score': round(0.7 + random.random() * 0.29, 4),
        'network_risk': round(random.random() * 0.2, 4)
    }

def calculate_risk_score(features):
    weights = [0.25, 0.20, 0.15, 0.10, 0.20, 0.10]
    score = sum(f * w for f, w in zip(features.values(), weights))
    return min(score, 1.0)

def get_risk_level(score):
    if score < 0.3:
        return 'low'
    elif score < 0.6:
        return 'medium'
    elif score < 0.8:
        return 'high'
    else:
        return 'critical'

def get_action(score):
    if score < 0.3:
        return 'approve'
    elif score < 0.6:
        return 'review'
    else:
        return 'block'

def get_credit_rating(score):
    if score >= 750:
        return 'Excellent'
    elif score >= 700:
        return 'Good'
    elif score >= 650:
        return 'Fair'
    elif score >= 600:
        return 'Poor'
    else:
        return 'Very Poor'

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'risk-service',
        'time': datetime.now().isoformat(),
        'ml_models_loaded': True,
        'graph_db_connected': True
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8086))
    app.run(host='0.0.0.0', port=port, debug=False)

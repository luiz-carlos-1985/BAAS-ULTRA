from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import uuid
import random
import os

app = Flask(__name__)

@app.route('/analytics/dashboard', methods=['GET'])
def dashboard():
    user_id = request.args.get('user_id')
    
    return jsonify({
        'user_id': user_id,
        'period': '30_days',
        'metrics': {
            'total_transactions': random.randint(50, 500),
            'total_volume': random.randint(10000, 100000),
            'average_transaction': random.randint(100, 1000),
            'top_category': 'Shopping',
            'savings_rate': round(random.uniform(10, 30), 2),
            'credit_utilization': round(random.uniform(20, 80), 2)
        },
        'trends': {
            'spending_trend': 'decreasing',
            'income_trend': 'stable',
            'savings_trend': 'increasing'
        },
        'predictions': {
            'next_month_spending': random.randint(8000, 12000),
            'savings_goal_achievement': round(random.uniform(70, 95), 2),
            'recommended_budget': random.randint(9000, 11000)
        },
        'insights': [
            'You spent 15% less this month',
            'Your savings rate is above average',
            'Consider investing surplus in high-yield accounts'
        ]
    }), 200

@app.route('/analytics/cash-flow-forecast', methods=['POST'])
def cash_flow_forecast():
    data = request.json
    user_id = data.get('user_id')
    days = data.get('days', 30)
    
    forecast = []
    current_balance = random.randint(5000, 20000)
    
    for i in range(days):
        date = datetime.now() + timedelta(days=i)
        income = random.randint(0, 5000) if i % 7 == 0 else 0
        expenses = random.randint(100, 500)
        current_balance += income - expenses
        
        forecast.append({
            'date': date.strftime('%Y-%m-%d'),
            'predicted_balance': current_balance,
            'predicted_income': income,
            'predicted_expenses': expenses,
            'confidence': round(random.uniform(0.85, 0.98), 2)
        })
    
    return jsonify({
        'user_id': user_id,
        'forecast': forecast,
        'ml_model': 'LSTM + Prophet'
    }), 200

@app.route('/analytics/financial-health-score', methods=['POST'])
def financial_health_score():
    data = request.json
    user_id = data.get('user_id')
    
    score = random.randint(650, 850)
    
    return jsonify({
        'user_id': user_id,
        'health_score': score,
        'rating': 'Excellent' if score >= 800 else 'Good' if score >= 700 else 'Fair',
        'factors': {
            'payment_history': round(random.uniform(0.7, 1.0), 2),
            'debt_to_income': round(random.uniform(0.2, 0.5), 2),
            'savings_rate': round(random.uniform(0.1, 0.3), 2)
        },
        'recommendations': [
            'Increase emergency fund to 6 months',
            'Reduce credit utilization below 30%'
        ]
    }), 200

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'analytics-service',
        'time': datetime.now().isoformat()
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8088))
    app.run(host='0.0.0.0', port=port, debug=False)

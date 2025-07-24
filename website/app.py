from flask import Flask, render_template, request, redirect, url_for, flash
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # For flash messages

# Connect MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['transaction_management_db']
users_collection = db['users']
transactions_collection = db['transactions']     



@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')
                                                         
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':         
        data = {
            "name": request.form['name'],
            "age": request.form['age'],
            "father_name": request.form['father_name'],            
            "mother_name": request.form['mother_name'],
            "account_no": request.form['account_no'],
            "ifsc_code": request.form['ifsc_code'],
            "branch": request.form['branch'],
            "pan_no": request.form['pan_no'],
            "aadhaar_no": request.form['aadhaar_no'], 
            "phone_no": request.form['phone_no'],
            "email": request.form['email'],
            "password": request.form['password']
        }
        users_collection.insert_one(data)
        
        return redirect(url_for('login'))
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = users_collection.find_one({'email': email, 'password': password})
        if user:
           
            return redirect(url_for('home'))
        else:
            flash("Invalid Credentials", "danger")
    return render_template('login.html')
 



@app.route('/create_account', methods=['GET', 'POST'])
def create_account():
    if request.method == 'POST':
        account_data = {
            "name": request.form['name'],
            "age": request.form['age'],
            "account_no": request.form['account_no'],
            "ifsc_code": request.form['ifsc_code'],
            "branch": request.form['branch'],
            "pan_no": request.form['pan_no'],
            "aadhaar_no": request.form['aadhaar_no'],
            "phone_no": request.form['phone_no'],
            "email": request.form['email'],
            "pin": request.form['pin'],
            "balance": 0
        }
        transactions_collection.insert_one(account_data)
        
        return redirect(url_for('deposit'))
    return render_template('accountcreation.html')  

@app.route('/deposit', methods=['GET', 'POST'])
def deposit():
    if request.method == 'POST':
        account_no = request.form['account_no']
        pin = request.form['pin']
        amount = float(request.form['amount'])

        user = transactions_collection.find_one({"account_no": account_no, "pin": pin})

        if user:
            new_balance = user['balance'] + amount
            transactions_collection.update_one(
                {"account_no": account_no},
                {"$set": {"balance": new_balance}}
            )

            transaction = {
                "type": "deposit",
                "amount": amount,
                "balance_after": new_balance,
                "datetime": datetime.now()
            }

            transactions_collection.update_one(
                {"account_no": account_no},
                {"$push": {"transaction_history": transaction}}
            )

            flash("Amount Deposited Successfully", "success")
        else:
            flash("Invalid Account Number or PIN", "danger")

    return render_template('depositmoney.html')
@app.route('/withdraw', methods=['GET', 'POST'])
def withdraw():
    if request.method == 'POST':
        account_no = request.form['account_no']
        pin = request.form['pin']
        amount = float(request.form['amount'])

        user = transactions_collection.find_one({"account_no": account_no, "pin": pin})

        if user:
            if user['balance'] >= amount:
                new_balance = user['balance'] - amount
                transactions_collection.update_one(
                    {"account_no": account_no},
                    {"$set": {"balance": new_balance}}
                )

                transaction = {
                    "type": "withdrawal",
                    "amount": amount,
                    "balance_after": new_balance,
                    "datetime": datetime.now()
                }

                transactions_collection.update_one(
                    {"account_no": account_no},
                    {"$push": {"transaction_history": transaction}}
                )

                flash("Amount Withdrawn Successfully", "success")
            else:
                flash("Insufficient balance", "warning")
        else:
            flash("Invalid Account Number or PIN", "danger")

    return render_template('withdrawl.html')


@app.route('/balance', methods=['GET', 'POST'])
def balance():
    if request.method == 'POST':
        account_no = request.form['account_no']
        pin = request.form['pin']
        user = transactions_collection.find_one({'account_no': account_no, 'pin': pin})
        if user:
            balance = user['balance']
            return render_template('balancemoney.html', balance=balance)
        else:
            flash("Invalid Account No or PIN", "danger")
            return redirect(url_for('balance'))  

    return render_template('balancemoney.html')                                                                                                                                                                                                                                                                                                                                                   

@app.route('/transactions', methods=['GET', 'POST'])
def transactions():
    if request.method == 'POST':
        account_no = request.form['account_no']
        pin = request.form['pin']

        user = transactions_collection.find_one({"account_no": account_no, "pin": pin})

        if user:
            txn_history = user.get('transaction_history', [])
            txn_history = sorted(txn_history, key=lambda x: x['datetime'], reverse=True)
            return render_template('transactions.html', transactions=txn_history)
        else:
            flash("Invalid Account Number or PIN", "danger")
            return redirect(url_for('transactions'))

    return render_template('transactions.html')



if __name__ == '__main__':     
    app.run(debug=True)   
        

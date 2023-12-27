import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

const PendingTransaction = () => {
  const history = useHistory();
  const [pendingTransactions, setPendingTransactions] = useState([]);

  useEffect(() => {
    // Fetch pending transactions when the component mounts
    fetch('http://dev-home:5000/transaction', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Pending transactions data:', data);
        setPendingTransactions(data.transactions);
      })
      .catch((error) => {
        console.error('Error fetching pending transactions:', error);
      });
  }, []);

  const handleApproval = (transactionId, decision) => {
    // Send a request to approve the transaction
    fetch(`http://dev-home:5000/approve_transaction/${transactionId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        decision: decision,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Transaction approved:', data);
        // Remove the approved transaction from the list
        setPendingTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction.id !== transactionId)
        );
      })
      .catch((error) => {
        console.error('Error approving transaction:', error);
      });
  };
  const handleLogout = () => {
    history.push('/login');
  };


  return (
    <div>
      <h1>Transazioni in sospeso</h1>
      <ul>
        {pendingTransactions.map((transaction) => (
          <li key={transaction.id}>
            <div>
              <strong>Utente:</strong> {transaction.username}
            </div>
            <div>
              <strong>Ammontare:</strong> {transaction.amount}
            </div>
            <div>
              <strong>Ragione:</strong> {transaction.reason}
            </div>
            <div>
              <button onClick={() => handleApproval(transaction.id, "approve")}>Approva</button>
              <button onClick={() => handleApproval(transaction.id, "deny")}>Nega</button>
            </div>
          </li>
        ))}
      </ul>
    <br />
    <br />
    <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default PendingTransaction;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addExpense, getExpenses, deleteExpense } from '../api';
import '../styles/Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ name: '', price: '', quantity: 1 });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('User ID is missing!');
      navigate('/');
      return;
    }

    const fetchExpenses = async () => {
      try {
        const response = await getExpenses(userId);
        const sortedExpenses = response.data.sort((a, b) => {
          if (a.price === b.price) {
            return a.name.localeCompare(b.name);
          }
          return a.price - b.price;
        });
        setExpenses(sortedExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, [userId, navigate]);

  const handleAddExpense = async () => {
    if (newExpense.name && parseFloat(newExpense.price) > 0) {
      try {
        const response = await addExpense({
          userId,
          name: newExpense.name,
          price: parseFloat(newExpense.price),
          quantity: Math.max(parseInt(newExpense.quantity) || 1, 1),
        });
        const updatedExpenses = [...expenses, response.data.expense].sort((a, b) => {
          if (a.price === b.price) {
            return a.name.localeCompare(b.name);
          }
          return a.price - b.price;
        });
        setExpenses(updatedExpenses);
        setNewExpense({ name: '', price: '', quantity: 1 });
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => {
      const price = isNaN(expense.price) ? 0 : expense.price;
      const quantity = isNaN(expense.quantity) || expense.quantity < 1 ? 1 : expense.quantity;
      return total + price * quantity;
    }, 0).toFixed(2);
  };

  return (
    <div className="expenses-container">
      <h2 className="expenses-title">Manage Expenses</h2>
      <form className="expenses-form">
        <input
          type="text"
          placeholder="Expense Name"
          value={newExpense.name}
          onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
          className="expense-input"
        />
        <input
          type="number"
          placeholder="Price"
          value={newExpense.price}
          onChange={(e) => setNewExpense({ ...newExpense, price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
          className="expense-input"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newExpense.quantity}
          min="1"
          onChange={(e) => setNewExpense({ ...newExpense, quantity: e.target.value === '' ? 1 : Math.max(parseInt(e.target.value), 1) })}
          className="expense-input"
        />
        <button type="button" onClick={handleAddExpense} className="expense-button">
          Add Expense
        </button>
      </form>
      <h3 className="expenses-list-title">Expense List</h3>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.name}</td>
              <td>{expense.price.toFixed(2)}</td>
              <td>{expense.quantity}</td>
              <td>{(expense.price * expense.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => handleDeleteExpense(expense._id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 className="total-expenses">Total Expenses: {calculateTotalExpenses()}</h3>
      <button onClick={() => navigate('/dashboard')} className="back-button">
        Back to Dashboard
      </button>
    </div>
  );
};

export default Expenses;

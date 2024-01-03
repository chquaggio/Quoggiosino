const BASE_URL = 'http://dev-home:5000';

export const login = async (username, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const fetchUserData = async (setUsername, setBalance) => {
  try {
    const response = await fetch('http://dev-home:5000/user_data', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setUsername(data.username);
      setBalance(data.balance);
    } else {
      console.error('Error fetching user data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

export const handleTransaction = async (transactionType, amount, selectedReason, setMessage, setAmount, setShowModal) => {
  try {
    const response = await fetch('http://dev-home:5000/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount) * (transactionType === 'gain' ? 1 : -1),
        reason: selectedReason,
      }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setMessage(data.message);
      alert(data.message);
      setAmount('');
    } else {
      console.error(`Error ${transactionType} money:`, response.statusText);
    }
  } catch (error) {
    console.error(`Error ${transactionType} money:`, error);
  }

  setShowModal(false);
};


export const fetchLeaderboardData = async () => {
  try {
    const response = await fetch('http://dev-home:5000/leaderboard', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Leaderboard data:', data);
    return data.leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }
};

export const handleDeleteUser = async (userUsername) => {
  try {
    const response = await fetch(`http://dev-home:5000/delete_user/${userUsername}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('User deleted:', data);

    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

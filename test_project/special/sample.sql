-- Sample SQL file
SELECT users.name, orders.price
FROM users
JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed';

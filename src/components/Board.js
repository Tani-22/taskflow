import React, { useState, useEffect } from 'react';
import { fetchTickets } from '../services/api';
import Ticket from './Ticket';

const Board = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await fetchTickets();
    setTickets(data.tickets);
  };

  const handleGroupingChange = (e) => {
    setGroupingOption(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const groupedTickets = () => {
    switch (groupingOption) {
      case 'status':
        return groupBy('status');
      case 'user':
        return groupBy('user');
      case 'priority':
        return groupBy('priority');
      default:
        return tickets;
    }
  };

  const groupBy = (key) => {
    return tickets.reduce((result, ticket) => {
      const group = ticket[key] || 'No ' + key;
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(ticket);
      return result;
    }, {});
  };

  const sortTickets = (tickets) => {
    if (sortOption === 'priority') {
      return tickets.sort((a, b) => b.priority - a.priority);
    }
    if (sortOption === 'title') {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets;
  };

  const renderTickets = () => {
    const grouped = groupedTickets();
    return Object.keys(grouped).map((group) => (
      <div key={group} className="ticket-group">
        <h3>{group}</h3>
        <div className="tickets">
          {sortTickets(grouped[group]).map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="board">
      <div className="controls">
        <label>Group by: </label>
        <select onChange={handleGroupingChange}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>

        <label>Sort by: </label>
        <select onChange={handleSortChange}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="kanban-columns">
        {renderTickets()}
      </div>
    </div>
  );
};

export default Board;

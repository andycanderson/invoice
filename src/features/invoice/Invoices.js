import React from 'react';
import { useSelector } from 'react-redux';
import { selectInvoices } from './invoiceSlice';
import styles from './Invoices.module.css';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { Link } from 'react-router-dom';


export const getTotal = (items) => {
  let total = 0;

  if (Array.isArray(items)) {
    total = items.reduce((acc, { amount }) => {
      const parsedAmount = parseFloat(amount, 10);

      if (!Number.isNaN(parsedAmount)) {
        return acc + parsedAmount;
      }
  
      return acc;
    }, 0);
  }

  // Add validation on for input numbers to limit to 2 decimal points
  return total.toFixed(2);
}

export function Invoices() {
  const invoices = useSelector(selectInvoices);

  return (
    <div className="page">
      <div className="page-header">
        <div>Invoices</div>
        <Button
          to="/create"
          variant="contained"
          color="primary"
          component={Link}
        >
          Create Invoice
          </Button>
      </div>
      <div className={styles.grid}>
        {invoices.map((invoice) => {
          return (
            <div
              className={styles.card}
              key={invoice.id}
            >
              <div>Invoice {invoice.id}</div>
              <div>Name: {invoice.name}</div>
              <div>Email: {invoice.email}</div>
              <div>Due Date: {moment(invoice.dueDate).format('M/DD/yyyy')}</div>
              <div className={styles.footer}>
                <div>Total: ${getTotal(invoice.items)}</div>
                <Button
                  color="primary"
                  to={`/${invoice.id}`}
                  variant="contained"
                  component={Link}
                >
                  Edit
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
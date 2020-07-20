import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import { createInvoice, editInvoice, deleteInvoice } from './invoiceSlice';
import { getTotal } from './Invoices';
import styles from './Invoice.module.css';

const filterInvalidItems = (items) => {
  if (!Array.isArray(items)) return [];

  return items.filter((item) => {
    const amount = parseFloat(item.amount, 10);
    return item.description && !Number.isNaN(amount);
  });
}

const findItemIndex = (items, id) => {
  if (!Array.isArray(items)) return null;

  return items.findIndex(item => item.id === id);
}

export function Invoice() {
  const { id } = useParams();
  const isCreate = !id;
  const history = useHistory();
  const invoice = useSelector(state => {
    if (isCreate) {
      return {
        name: '',
        email: '',
        dueDate: null,
        items: [
          {
            id: '1',
            description: '',
            amount: '',
          }
        ]
      };
    }

    return state.invoice.invoices.find(invoice => invoice.id === id);
  });
  const [invoiceState, setInvoiceState] = useState(invoice);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    const invoiceData = {
      ...invoiceState,
      items: filterInvalidItems(invoiceState.items)
    };

    if (isCreate) {
      dispatch(createInvoice(invoiceData));
    } else {
      dispatch(editInvoice({ id, invoice: invoiceData }));
    }

    history.push('/');
  }

  const onDelete = () => {
    dispatch(deleteInvoice(id));

    history.push('/');
  }
  
  const addItem = (event) => {
    const items = invoiceState.items.slice();

    items.push({ 
      id: `${Array.isArray(invoiceState.items) ?  invoiceState.items.length + 1 : 1}`,
      description: '', 
      amount: '' 
    });
    setInvoiceState({ ...invoiceState, items });
  }

  const isDisabled = () => {
    const { items } = invoiceState;

    if (!Array.isArray(items)) return true;

    let hasValidLineItem = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const amount = parseFloat(item.amount, 10);

      if (item.description && !Number.isNaN(amount)) {
        hasValidLineItem = true;
        break;
      }
    }

    return !hasValidLineItem;
  }

  return (
    <div className="page">
      <div className="page-header">
        {id ? `Edit Invoice ${id}` : 'Create Invoice'}
      </div>
      <form onSubmit={onSubmit}>
        <div className={styles.grid}>
          <TextField
            type="text"
            label="Name"
            value={invoiceState.name}
            onChange={(e) => {
              setInvoiceState({ 
                ...invoiceState, 
                name: e.target.value 
              })
            }}
          />
          <TextField
            type="email"
            label="Email"
            value={invoiceState.email}
            onChange={(e) =>
              setInvoiceState({ ...invoiceState, email: e.target.value })
            }
          />
          <MuiPickersUtilsProvider 
          utils={MomentUtils}
          >
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="M/DD/yyyy"
              margin="normal"
              label="Due Date"
              value={invoiceState.dueDate}
              onChange={(val) => {
                const dueDate = val.toISOString();
                setInvoiceState({ ...invoiceState, dueDate })
              
              }}
              KeyboardButtonProps={{
                'aria-label': 'change due date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        
        <div className={styles.subheader}>Line Items</div>

        <div className={styles.grid}>
        {invoiceState.items.map(({ id, description, amount }) => {
          return (
            <React.Fragment key={id}> 
              <TextField
                type="text"
                label="Description"
                value={description}
                onChange={(e) => {
                  const index = findItemIndex(invoiceState.items, id);
                  if (index > -1) {
                    const val = e.target.value;
                    const item = { 
                      ...invoiceState.items[index], 
                      description: val };
                    const items = invoiceState.items.slice();
                    items[index] = item;

                    setInvoiceState({
                      ...invoiceState,
                      items
                    });
                  }
                }}
              />
               <TextField
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => {
                  const index = findItemIndex(invoiceState.items, id);
                  if (index > -1) {
                    const val = e.target.value;
                    const item = { 
                      ...invoiceState.items[index], 
                      amount: val 
                    };
                    const items = invoiceState.items.slice();
                    items[index] = item;

                    setInvoiceState({
                      ...invoiceState,
                      items
                    });
                  }
                }}
              />
            </React.Fragment>
          );
        })}
        </div>
        <div className={styles.add}>
          <Button
            variant="outlined"
            color="primary"
            type="button"
            onClick={addItem}
          >
            Add Line Item
        </Button>
        </div>
        <div className={styles.total}>
          Total ${getTotal(invoiceState.items)}
        </div>
        <div className={styles.actions}>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={isDisabled()}
          >
            {isCreate ? 'Create' : 'Edit'}
          </Button>
          {!isCreate &&
            <Button
              variant="contained"
              color="secondary"
              type="button"
              onClick={onDelete}
            >
              Delete
          </Button>
          }
        </div>
        
      </form>
    </div>
  );
}
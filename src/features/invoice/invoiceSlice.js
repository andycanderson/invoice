import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';

export const getNextId = (items) => {
  let nextId = 1;

  items.forEach(({ id }) => {
    const parsedId = parseInt(id, 10);

    if (parsedId > nextId) {
      nextId = parsedId
    }
  });

  return `${nextId + 1}`;
}

export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    invoices: [
      {
        id: '1',
        name: 'Bob',
        email: 'bob@gmail.com',
        dueDate: (new moment()).toISOString(),
        items: [
          {
            id: '1',
            description: 'Fix a/c',
            amount: '100'
          },
          {
            id: '2',
            description: 'Fix lights',
            amount: '50'
          }
        ],
      }
    ],
    // new: undefined,
  },
  reducers: {
    createInvoice: (state, action) => {
      state.invoices.push({ 
        ...action.payload, 
        id: getNextId(state.invoices), 
      })
    },
    editInvoice: (state, action) => {
      const id = action.payload.id;
      const index = state.invoices.findIndex(invoice => id === invoice.id);

      state.invoices[index] = action.payload.invoice;
    },
    deleteInvoice: (state, action) => {
      const index = state.invoices.findIndex(invoice => invoice.id === action.payload);

      state.invoices.splice(index, 1);
    }
  },
});

export const { createInvoice, editInvoice, deleteInvoice } = invoiceSlice.actions;

export const selectInvoices = state => state.invoice.invoices;


export default invoiceSlice.reducer;

import uuid from 'uuid';
import database from '../firebase/firebase';
// import expenses2 from '../tests/fixtures/expenses';
// ADD_EXPENSE
export const addExpense = (expense) => ({
  type: 'ADD_EXPENSE',
  expense
});

//middleware thunk allows us to return a function
/*
-query db
-dispatch action

*/
export const startAddExpense = (expenseData = {}) => {
  return (dispatch,getState) => {;
    const uid = getState().auth.uid;
    const {
      description = '',
      note = '',
      amount = 0,
      createdAt = 0
    } = expenseData;
    const expense = { description, note, amount, createdAt };

    return database.ref(`users/${uid}/expenses`).push(expense).then((ref) => {
      dispatch(addExpense({
        id: ref.key,
        ...expense
      }));
    });
  };
};

// REMOVE_EXPENSE
export const removeExpense = (id) => ({
  type: 'REMOVE_EXPENSE',
  id
});

export const startRemoveExpense = ({id} = {})=>{
  return (dispatch, getState)=>{
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/expenses/${id}`).remove()
    .then((r)=>{
      console.log("yes",r);
      dispatch(removeExpense(id));
    })   
    .catch((e)=>{
      console.log("no",e);
    })       
  }
}

// EDIT_EXPENSE
export const editExpense = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
});

export const startEditExpense = (id, updates) =>{
  return (dispatch, getState)=>{
    const uid = getState().auth.uid;
    return database.ref('users/' + uid +  '/expenses/' + id).update(updates)
    .then((s)=>{
      console.log("success");
      dispatch(editExpense(id, updates))
    })
  }
}

// SET_EXPENSES
export const setExpenses =(expenses = [])=>{
  return {
    type: 'SET_EXPENSES',
    expenses
  }
};

export const startSetExpenses =()=>{
  return (dispatch, getState)=>{
    const uid = getState().auth.uid;
    return database.ref(`users/${uid}/expenses`).once('value')
    .then(function(dataSnapshot) {
      // handle read data.
        let expenses2 = []
        dataSnapshot.forEach(function (childSnapshot) {
          var value = childSnapshot.val();
          expenses2.push({
            id: childSnapshot.key,
            ...value
          })
        });
        dispatch(setExpenses(expenses2));
    })
  }
};




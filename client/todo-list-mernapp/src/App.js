import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [completedList, setCompletedList] = useState([]);


  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', { item: itemText })
      setListItems(prev => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  }


  //Function to fetch all todo items from database -- we will use useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items')
        setListItems(res.data);
        console.log('render')
      } catch (err) {
        console.log(err);
      }
    }
    getItemsList()
  }, []);

  // Delete item when click on delete
  const deleteItem = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
      const newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  }
  //count pending items
  useEffect(() => {
    const count = listItems.filter(item => !item.completed && !item.deleted).length;
    setPendingCount(count);
  }, [listItems, completedList]);


  //done
  const doneItem = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${id}/status`, { completed: true });
      const updatedItemIndex = listItems.findIndex(item => item._id === id);
      const updatedItem = listItems[updatedItemIndex];
      const newListItems = [...listItems];
      newListItems.splice(updatedItemIndex, 1);
      setListItems(newListItems);
      setCompletedList(prev => [...prev, updatedItem]);
      setPendingCount(count => count - 1);
    } catch (err) {
      console.log(err);
    }
  }




  //clear completed list
  const clearCompletedList = () => {
    setCompletedList([]);
  }

  //Update item
  const updateItem = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updateItemText })
      console.log(res.data)
      const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
      const updatedItem = listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.log(err);
    }
  }
  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => { updateItem(e) }} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e => { setUpdateItemText(e.target.value) }} value={updateItemText} required />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => { setItemText(e.target.value) }} value={itemText} required />
        <button type="submit"><i class="fa fa-plus"></i></button>
      </form>


      <div className="todo-listItems">
      <div className='pending'><p>{pendingCount} items pending</p></div>
        {
          listItems.map(item => (
            <div className="todo-item">
              {
                isUpdating === item._id
                  ? renderUpdateForm()
                  : <>
                    <p className="item-content">{item.item}</p>
                    <button className="update-item" onClick={() => { setIsUpdating(item._id) }}><i class="fa fa-edit" ></i></button>
                    <button className="done-item" onClick={() => { doneItem(item._id) }}><i class="fa fa-check"></i></button>
                    <button className="delete-item" onClick={() => { deleteItem(item._id) }}><i class="fa fa-trash"></i></button>
                  </>
              }
            </div>
          ))
        }
        
        <div className='completed'><p>{completedList.length} items completed</p></div>
        <div className="completed-listItems">
          {completedList.map(item => (
            <div key={item._id} className="completed-item">
              <p>{item.item}</p>
            </div>
          ))}
        </div>
        <button className="clear-item" onClick={clearCompletedList}>Clear Completed Items</button>
      </div>
    </div>
  );
}

export default App;

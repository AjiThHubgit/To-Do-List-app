import React, { useState, useEffect } from 'react';

const ToDo = () => {
    const [text, setText] = useState(''); // input field
    const [todoList, setTodoList] = useState([]); // storgae data for view the record
    const [btnFlag, setbtnFlag] = useState(true); // true - Add List / false - Update List
    const [updateId, setUpdateId] = useState(null); // storge the update id to update the todo list..

    useEffect(() => {
        const storedTodos = JSON.parse(localStorage.getItem('todo_details'));
        if (storedTodos) {
            setTodoList(storedTodos);
        }
    }, []);

    const updateLocalStorageData = (updatedList) => {
        setTodoList(updatedList);
        localStorage.setItem('todo_details', JSON.stringify(updatedList));
    }

    const handleAddTodo = () => {
        if (text.trim() === '') return;

        const lastId = todoList.reduce((maxId, item) => Math.max(maxId, item.id), 0);
        const newTodo = {
            id: lastId + 1,
            content: text,
            completed: false,
        };

        const updatedTodos = [...todoList, newTodo];
        updateLocalStorageData(updatedTodos);
        // setTodoList(updatedTodos);
        // localStorage.setItem('todo_details', JSON.stringify(updatedTodos));

        setText('');
    };

    const handleEdit = (list) => {
        setbtnFlag(false);
        setUpdateId(list.id);
        setText(list.content);
    }

    const handleUpdateTodo = () => {

        const updatedList = todoList.map((item) => {
            if (item.id === updateId) {
                return { ...item, content: text };
            }
            return item;
        });
        updateLocalStorageData(updatedList);
        // setTodoList(updatedList);
        // localStorage.setItem('todo_details', JSON.stringify(updatedList));

        // reset states
        setbtnFlag(true);
        setUpdateId(null);
        setText('');
    };

    const handleDelete = (listId) => {
        const deleteList = todoList.filter((list) => list.id !== listId);
        updateLocalStorageData(deleteList);
        // setTodoList(deleteList);
        // localStorage.setItem('todo_details', JSON.stringify(deleteList));
    }

    const handleOnCompleteChange = (getId) => {

        const updateList = todoList.map(list => list.id === getId ? { ...list, completed: !list.completed } : list);
        updateList.sort((a, b) => a.completed - b.completed || a.id - b.id);
        updateLocalStorageData(updateList);
        // setTodoList(updateList);
        // localStorage.setItem('todo_details', JSON.stringify(updateList));
    }

    return (
        <div className="p-4 w-[50%] mx-auto">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter todo..."
                className="w-full py-2 px-4 border rounded focus:outline-none focus:border-blue-500"
            />

            {btnFlag &&
                <button
                    onClick={handleAddTodo}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Add List
                </button>
            }

            {!btnFlag &&

                <button
                    onClick={handleUpdateTodo}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Update List
                </button>

            }

            {todoList.map((todo) => (
                <div key={todo.id} className='flex justify-between my-3'>
                    <div key={todo.id} className={`py-2 ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                        <input className='cursor-pointer' type="checkbox" checked={todo.completed} onChange={() => handleOnCompleteChange(todo.id)} />
                        <span className='ml-2'>{todo.completed}{todo.content}</span>
                    </div>
                    <div>
                        <button disabled={todo.completed} className={`${todo.completed ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 cursor-pointer'} p-2 rounded mr-3`} onClick={() => handleEdit(todo)}>Edit</button>
                        <button disabled={todo.completed} className={`${todo.completed ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 cursor-pointer'} p-2 rounded mr-3`} onClick={() => handleDelete(todo.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToDo;

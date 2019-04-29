import React, {Component} from 'react';
import axios from 'axios';
import ReactDataGrid from 'react-data-grid';


const columns = [
    { key: "todo_description", name: "Description", editable: true },
    { key: "todo_responsible", name: "Responsible", editable: true },
    { key: "todo_priority", name: "Priority", editable: true },
  ];

export default class TodosList extends Component {
    constructor(props){
        super(props);

        this.state = 
            {todos: []};

    }

      onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        
        this.setState(state => {
        const rows = state.todos.slice();
          for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
            axios.post('http://localhost:4000/todos/update/'+rows[i]['_id'], rows[i])
            .then(res => console.log(res.data));
          }
          return { todos: rows };
        });
      };

    componentDidMount() {

        axios.get('http://localhost:4000/todos/')
            .then(response => {
                this.setState({todos: response.data});
                console.log("post-response state: " + JSON.stringify(this.state));
            })
            .catch(function (error){
                console.log(error);
            });
    }

    insertRow = () => {
        console.log('insertrow');

        const newTodo = {
            todo_description: "",
            todo_responsible: "",
            todo_priority: "",
            todo_completed: false
        };

        axios.post('http://localhost:4000/todos/add', newTodo)
            .then(res => {
                console.log("post res: " +JSON.stringify(res.data));
                this.componentDidMount();
            });

      };
      
      deleteRow = () => {
        const rows = this.state.todos.slice();
        const newRows = this.state.todos.slice();
        newRows.splice(newRows.length-1,1);
        console.log('new rows: ' + JSON.stringify(newRows));
        this.setState({todos: newRows});

        console.log('http://localhost:4000/todos/delete/'+rows[rows.length-1]['_id']);
        axios.delete('http://localhost:4000/todos/delete/'+rows[rows.length-1]['_id'])
        .then(
            console.log('delete successful'));
      }

    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <ReactDataGrid
                columns={columns}
                rowGetter={i => this.state.todos[i]}
                rowsCount={this.state.todos.length}
                onGridRowsUpdated={this.onGridRowsUpdated}
                enableCellSelect={true}
                />

                <button onClick={this.insertRow}> Add Row </button>
                <button onClick={this.deleteRow}> Delete Row </button>
            </div>

        )
    }
}
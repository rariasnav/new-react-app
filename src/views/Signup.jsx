import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../js/store/appContext";

export const Signup = () =>{
    const navigate = useNavigate();
    const {actions, store} = useContext(Context);
    const [form, setForm] = useState({
        "username":"",
        "password":"",
        "name":"",
        "surname":"",
    });

    const handleChange = (e) => {
        setForm({
            ...form, [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await actions.createUser(form);
        if(response==201) {
            navigate("/login")
        }
    };

    return(
        <div className="container">
            <div className="body text-center m-5">
                <h1>Register</h1>
                    <form className="m-auto" style={{width: "26rem"}}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" aria-describedby="emailHelp"
                                name="username" value={form.username} onChange={handleChange} required />                        
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="surname" className="form-label">Surname</label>
                            <input type="text" className="form-control" name="surname" value={form.surname} onChange={handleChange} required />
                        </div>                 
                        <button type="submit" className="btn btn-primary" onClick={(e)=> handleSubmit(e)} >Signup</button>
                    </form>                
            </div>
        </div>
    )
};
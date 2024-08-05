import React, { useContext } from 'react';
import { Context } from '../js/store/appContext';
import Navbar from '../components/Navbar';

const Home = () => {
    const { store, actions } = useContext(Context);
  return (
    <div>
      <Navbar />
      <h5>{store.personas}</h5>
    </div>
  )
}

export default Home;

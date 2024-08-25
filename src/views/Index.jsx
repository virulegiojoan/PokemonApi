import React, { useEffect, useState } from 'react';
import { Container, Row, Col, InputGroup, InputGroupText, Input } from 'reactstrap';
import axios from 'axios';
import PokeTarjeta from '../components/PokeTarjeta'; 
import { PaginationControl } from 'react-bootstrap-pagination-control';

const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const[allPokemons, setAllPokemons] = useState([]);
  const[listado, setListado] = useState([]);
  const[filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getPokemones(offset);
    getAllPokemones();
  }, [offset]); 

  const getPokemones = async (o) => {
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${o}`;
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setListado(respuesta.results);
      setTotal(respuesta.count);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const getAllPokemones = async () => {
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    axios.get(liga)
    .then(async (response) => {
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setAllPokemons(respuesta.results);
    }) 
  };

  const buscarPokemones =async (e) => {
    if (e.keyCode === 13 ){
      if(filtro.trim() != ''){
        setListado([]);
        setTimeout(()=> {
          setListado(allPokemons.filter(p => p.name.toLowerCase().includes(filtro)));
        },100)
      }
      
    }
  };

  const goPage = async (p) => {
    setListado([]);
    await getPokemones((p==1)? 0 : (p-1)*20);
    setOffset(p);
  };

  return (
    <Container className='shadow bg-Secondary mt-3'>
      <Row >
        <Col xs="12">
          <InputGroup className=' mt-3 mb-3'>
            <InputGroupText> <i className='fa-solid fa-search'> </i> </InputGroupText>
            <Input value={filtro} onChange={(e) => {setFiltro(e.target.value)}} 
            onKeyUpCapture={buscarPokemones} placeholder='Search Pokemon' />
          </InputGroup>
        </Col>
      </Row>
      <Row className='mt-3'>
        {listado.map((pok, i) => (
          <PokeTarjeta poke={pok} key={i} />
        ))}
        {listado.length === 0 ? 
        <Col className='text-center fs-2 mb-3 text-dark'> <b>No hay pokemones para mostrar</b></Col> 
           : ''}

        <PaginationControl last={true} limit={limit} total={total }
         page={offset} changePage={page => goPage(page)} />
      </Row>
    </Container>
  );
};

export default Index;

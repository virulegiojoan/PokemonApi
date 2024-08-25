import React, { useEffect, useState } from 'react';
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from 'reactstrap';
import axios from 'axios';

const PokeTarjeta = ({ poke }) => {
  const [pokemon, setPokemon] = useState(null); 
  const [imagen, setImagen] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    const liga = poke.url;
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;

      const imagenUrl = respuesta.sprites.other['official-artwork'].front_default;
      setImagen(imagenUrl || respuesta.sprites.front_default); 

      setPokemon(respuesta);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data: ", error);
      setLoading(false); 
    }
  };

  return (
    <Col sm='4' lg='3' className='mb-3'>
      <Card className='card-hover shadow border-4 border-secondary'>
        {loading ? (
          <CardImg src='/public/img/loading2.gif' height='200' className='p-3' alt='Loading...' />
        ) : (
          <CardImg src={imagen} height='150' className='p-2' alt={pokemon?.name || 'Pokemon'} />
        )}
        {!loading && pokemon && (
          <>
            <CardBody className='text-center'>
              <h5 className='text-capitalize'>{pokemon.name}</h5>
              <Badge pill color='danger'>#{pokemon.id}</Badge>
            </CardBody>
            <CardFooter className='text-center'>
              <a href={`/pokemon/${pokemon.name}`} className='btn btn-dark'>
                <i className='fa-solid fa-arrow-up-right-from-square'></i> 
                 Detalle
              </a>
            </CardFooter>
          </>
        )}
      </Card>
    </Col>
  );
};

export default PokeTarjeta;

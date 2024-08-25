import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardText, Badge } from 'reactstrap';
import axios from 'axios';
import PokeTarjeta from '../components/PokeTarjeta'; // Asegúrate de importar esto correctamente

const Detalle = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState({});
  const [habitat, setHabitat] = useState('Desconocido');
  const [imagen, setImagen] = useState('');
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoadClass] = useState('');
  const [especie, setEspecie] = useState('');
  const [habilidades, setHabilidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [estadisticas, setEstadisticas] = useState([]);
  const [evoluciones, setEvoluciones] = useState([]);
  const [listaEvoluciones, setlistaEvoluciones] = useState([]);

  useEffect(() => {
    getPokemon();
  }, [id]);

  const getPokemon = async () => {
    const liga = 'https://pokeapi.co/api/v2/pokemon/' + id;
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;
      console.log('Pokemon data:', respuesta); // Para depuración
      setPokemon(respuesta);
      if (respuesta.sprites.other.dream_world.front_default != null) {
        setImagen(respuesta.sprites.other.dream_world.front_default);
      } else {
        setImagen(respuesta.sprites.other['official-artwork'].front_default);
      }
      await getTipos(respuesta.types);
      await getEspecie(respuesta.species.name);
      await getHabilidades(respuesta.abilities);
      await getEstadisticas(respuesta.stats);
      setCardClass('');
      setLoadClass('d-none');
    } catch (error) {
      console.error("Error fetching Pokemon data: ", error);
    }
  };

  const getEstadisticas = async (es) => {
    let listaEs = [];
    await Promise.all(es.map(async (e) => {
      try {
        const response = await axios.get(e.stat.url);
        listaEs.push({ 'nombre': response.data.names[5].name, 'valor': e.base_stat });
      } catch (error) {
        console.error("Error fetching statistics data: ", error);
      }
    }));
    setEstadisticas(listaEs);
  };

  const getTipos = async (tip) => {
    let listaTipos = [];
    await Promise.all(tip.map(async (t) => {
      try {
        const response = await axios.get(t.type.url);
        listaTipos.push(response.data.names[5].name);
      } catch (error) {
        console.error("Error fetching type data: ", error);
      }
    }));
    setTipos(listaTipos);
  }

  const getHabilidades = async (hab) => {
    let listaHab = [];
    await Promise.all(hab.map(async (h) => {
      try {
        const response = await axios.get(h.ability.url);
        listaHab.push(response.data.names[5].name);
      } catch (error) {
        console.error("Error fetching abilities data: ", error);
      }
    }));
    setHabilidades(listaHab);
  }

  const getEspecie = async (esp) => {
    const liga = 'https://pokeapi.co/api/v2/pokemon-species/' + esp;
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;
      console.log('Species data:', respuesta); // Para depuración
      setEspecie(respuesta);
      if (respuesta.habitat != null) {
        await getHabitat(respuesta.habitat.url);
      }
      await getDescripcion(respuesta.flavor_text_entries);
      await getEvoluciones(respuesta.evolution_chain.url);
    } catch (error) {
      console.error("Error fetching species data: ", error);
    }
  }

  const getEvoluciones = async (ev) => {
    try {
      const response = await axios.get(ev);
      const respuesta = response.data;
      let lista = respuesta.chain.species.url.replace('-species', '');
      lista += ' ' + procesaEvoluciones(respuesta.chain);
      setEvoluciones(lista);
      let apoyo = lista.split(' ');
      let list = [];
      apoyo.forEach(ap => {
        if (ap !== '') {
          list.push({ url: ap });
        }
      });
      setlistaEvoluciones(list);
    } catch (error) {
      console.error("Error fetching evolution data: ", error);
    }
  };

  const procesaEvoluciones = (info) => {
    let res = '';
    if (info.evolves_to.length > 0) {
      res += ' ' + info.evolves_to[0].species.url.replace('-species', '');
      return res + ' ' + procesaEvoluciones(info.evolves_to[0]);
    } else {
      return res;
    }
  };

  const getHabitat = async (hab) => {
    try {
      const response = await axios.get(hab);
      setHabitat(response.data.names[1].name);
    } catch (error) {
      console.error("Error fetching habitat data: ", error);
    }
  }

  const getDescripcion = async (desc) => {
    let texto = '';
    desc.forEach((d) => {
      if (d.language.name === 'es') {
        texto = d.flavor_text;
      }
    });
    if (texto === '' && desc.length > 0) {
      texto = desc[0].flavor_text;
    }
    setDescripcion(texto);
  }

  return (
    <Container className="bg-dark-subtle mt-3">
      <Row>
        <Col>
          <Card className='shadow mt-3 mb-3'>
            <CardBody className="mt-3">
              <Row>
                <Col sm="3">
                  <Link to='/' className="btn btn-outline-dark">
                    <i className="fa-solid fa-home"></i> Inicio
                  </Link>
                </Col>
              </Row>
              <Row className={loadClass}>
                <Col md='12'>
                  <img src='/public/img/loading2.gif' className='w-100' alt='Loading...' />
                </Col>
              </Row>
              <Row className={cardClass}>
                <Col md='6'>
                  <CardText className='h1 text-capitalize'>{pokemon.name}</CardText>
                  <CardText className='fs-3'>{descripcion}</CardText>
                  <CardText className='fs-5'>
                    Altura: <b>{(pokemon.height) / 10}m</b>
                    Peso: <b>{(pokemon.weight) / 10}kg</b>
                  </CardText>
                  <CardText className='fs-5'>
                    Tipo:
                    {tipos.map((tip, i) => (
                      <Badge pill className='me-1' color='secondary' key={i}>
                        {tip}
                      </Badge>
                    ))}
                  </CardText>
                  <CardText className='fs-5'>
                    Habilidades:
                    {habilidades.map((hab, i) => (
                      <Badge pill className='me-1' color='dark' key={i}>
                        {hab}
                      </Badge>
                    ))}
                  </CardText>
                  <CardText className='fs-5'>
                    Habitat: <b>{habitat}</b>
                  </CardText>
                </Col>
                <Col md='6'>
                  <img src={imagen} className='img-fluid animate__animated animate__backInRight' alt="" />
                </Col>
                <Col md='12' className='mt-3'>
                  <CardText className='fs-4 text-center'><b>Estadísticas</b></CardText>
                </Col>
                <Col md='12' className='mt-3'>
                  {estadisticas.map((es, i) => (
                    <Row key={i}>
                      <Col xs='6' md='3'><b>{es.nombre}</b></Col>
                      <Col xs='6' md='9'>
                        <progress className='my-2' value={es.valor} max="100">{es.valor}</progress>
                      </Col>
                    </Row>
                  ))}
                </Col>
                <Col md='12' className='mt-3'>
                  <CardText className='fs-4 text-center'><b>Cadena de Evolución</b></CardText>
                </Col>
                {listaEvoluciones.map((pok, i) => (
                  <PokeTarjeta poke={pok} key={i} />
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Detalle;

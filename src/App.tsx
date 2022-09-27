import { MouseEvent ,useEffect, useRef, useState } from 'react';
import {FaSearch} from 'react-icons/fa'
import './App.css';
import { Photo } from './components/Photo';
import { mainUrl, searchUrl } from './utils/constants';
import { IPhotosResponse } from './interfaces/IPhotosResponse';

const clientID = `?client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`

function App() {

  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<IPhotosResponse[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [newImages, setNewImages] = useState(false);
  const mounted = useRef(false);

  const fetchImages = async() => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;

    if(query){
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`
    }else{
      url = `${mainUrl}${clientID}${urlPage}`
    };
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if(query && page === 1){
          return data.results
        }else if(query){
          return [...oldPhotos, ...data.results]
        }else{
          return [...oldPhotos, ...data]
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);
      setLoading(false);
      throw new Error;
    }
  };

useEffect(() => {
  fetchImages()
}, [page]);

useEffect(() => {
  if(!mounted.current){
    mounted.current = true;
    return;
  }
  if(!newImages) return;
  if(loading) return;

  setPage((oldPAge) => oldPAge + 1)
}, [newImages]);

const event = () => {
  if(window.innerHeight + window.scrollY >= document.body.scrollHeight -2){
    setNewImages(true);
  }
};

useEffect(() => {
  window.addEventListener('scroll', event);

  return () => window.removeEventListener('scroll', event)
}, [])



const handleSubmit = (e:MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  if(!query) return;
  if(page === 1){
    fetchImages();
    return;
  }
  setPage(1);
};

  return (
   <main>
    <section className="search">
      <form className="search-form">
        <input
          type="text" 
          placeholder='search'
          className='form-input'
          value={query}
          onChange={(e)=> {setQuery(e.target.value)}}
        />
        <button
          type='submit'
          className='submit-btn'
          onClick={handleSubmit}
        >
          <FaSearch />
        </button>
      </form>
    </section>
    <section className="photos">
      <div className="photos-center">
        {
          photos.map( (photo, index) => (
            <Photo
              key={index} 
              {...photo}
            />
          ) )
        }
      </div>
      {loading && <h2 className='loading'>loading...</h2>}
    </section>
   </main>
  )
}

export default App

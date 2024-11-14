
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function DrugDetail() {
  const { drugName } = useParams();
  const [ndcs, setNdcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const[synonyms, setSynonyms]= useState([])
  useEffect(() => {
    const fetchNDCs = async () => {
      try {
        const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/ndcs.json?drugName=${drugName}`);
        setNdcs(response.data.ndcGroup.ndcList || []);
        const rxcuiResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugName}`);
            const rxcui = rxcuiResponse.data.idGroup.rxnormId[0];
            
            const ndcsResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/ndcs.json?drugName=${drugName}`);
            setNdcs(ndcsResponse.data.ndcGroup.ndcList || []);
            
            const synonymsResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/synonyms.json?rxcui=${rxcui}`);
            setSynonyms(synonymsResponse.data.synonymGroup.synonym || []);
      } catch (error) {
        console.error("Error fetching NDCs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNDCs();
  }, [drugName]);

  return (
    <div className="drug-detail">
      <header className="drug-detail-header">
        <img src="/logo.png" alt="XOGENE LOGO" className="logo" />
        <h1>DRUG DETAILS</h1>
      </header>
      <h2>{drugName}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="drug-info">
          <p><strong>ID:</strong> {drugName}</p>
          <p><strong>Synonyms:</strong>{synonyms.join(', ')}</p> 
          <h3>NDCs</h3>
          {ndcs.length > 0 ? (
            <ul className="ndc-list">
              {ndcs.map((ndc, index) => (
                <li key={index}>{ndc}</li>
              ))}
            </ul>
          ) : (
            <p>No NDCs found for this drug.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default DrugDetail;
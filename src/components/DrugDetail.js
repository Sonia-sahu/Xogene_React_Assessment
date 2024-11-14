import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DrugDetail = ({ drugName }) => {
  const [rxnormId, setRxnormId] = useState(null);
  const [synonyms, setSynonyms] = useState([]);
  const [ndcs, setNdcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        setLoading(true);
        setError(null);

      
        const rxcuiResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugName}`);
        console.log('RxNorm ID Response:', rxcuiResponse.data); 

        const rxcui = rxcuiResponse.data.idGroup?.rxnormId?.[0] || null;
        
        if (!rxcui) {
          setError("RxNorm ID not found for the provided drug.");
          setLoading(false);
          return;
        }

        setRxnormId(rxcui);

        
        const synonymsResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/rxcui/properties?rxnormId=${rxcui}`);
        console.log('Synonyms Response:', synonymsResponse.data); 
        setSynonyms(synonymsResponse.data?.properties?.synonym || []);

        const ndcsResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/rxcui/ndcs?rxnormId=${rxcui}`);
        console.log('NDCs Response:', ndcsResponse.data); 
        setNdcs(ndcsResponse.data?.ndcGroup?.ndcList || []);
        
      } catch (error) {
        console.error('Error fetching drug details:', error);
        setError("An error occurred while fetching the data.");
      } finally {
        setLoading(false);
      }
    };

    if (drugName) {
      fetchDrugDetails();
    }
  }, [drugName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Drug Details for "{drugName}"</h2>
      {rxnormId ? (
        <p><strong>RxNorm ID (RXCUI):</strong> {rxnormId}</p>
      ) : (
        <p>No RxNorm ID found.</p>
      )}

      {synonyms.length > 0 ? (
        <p><strong>Synonyms:</strong> {synonyms.join(', ')}</p>
      ) : (
        <p>No synonyms found.</p>
      )}

      {ndcs.length > 0 ? (
        <>
          <h3>Related National Drug Codes (NDCs):</h3>
          <ul>
            {ndcs.map((ndc, index) => (
              <li key={index}>{ndc}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>No related NDCs found for this drug.</p>
      )}
    </div>
  );
};

export default DrugDetail;

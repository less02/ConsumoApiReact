import { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Input, Modal, Select, Image } from 'antd';
import './App.css';
import { getData } from './logic/api';

function App() {
  const [catModal, setCatModal] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [cats, setCats] = useState([]);
  const [filterOrigin, setFilterOrigin] = useState('');
  const [search, setSearch] = useState('');

  const url = "https://api.thecatapi.com/v1/breeds";
  const api_key = "live_z6nSf8UpgJ8cLObrbMhvpekEtWWIc6kxKMBgIV2jI9PwT62q5Jm2r563xb6O3deS";

  const headers = {
    'x-api-key': api_key
  };

  async function getDataFromApi() {
    const data = await getData(url, headers);
    setCats(data);
  }

  useEffect(() => {
    getDataFromApi();
  }, []);

  function openCatModal(cat) {
    setSelectedCat(cat);
    setCatModal(true);
  }

  function closeCatModal() {
    setCatModal(false);
    setSelectedCat(null);
  }

  const getUniqueOrigins = () => {
    const origins = cats.map(cat => cat.origin);
    return Array.from(new Set(origins)).map(origin => ({
      label: origin,
      value: origin
    }));
  };

  const handleFilterChange = (value) => {
    setFilterOrigin(value);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredCats = cats.filter(cat => {
    const matchesOrigin = filterOrigin ? cat.origin === filterOrigin : true;
    const matchesSearch = search ? cat.name.toLowerCase().includes(search) : true;
    return matchesOrigin && matchesSearch;
  });

  const columns = [
    {
      title: 'Raza',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Origen',
      dataIndex: 'origin',
      key: 'origin',
    },
    {
      title: 'Inteligencia',
      dataIndex: 'intelligence',
      key: 'intelligence',
    }
  ];

  return (
    <>
      <h1>Razas de 😺🐈‍⬛ GATITOS!</h1>
      <div style={{ marginBottom: 20, display: 'flex', gap: '10px' }}>
        <Select
          style={{ width: 200 }}
          placeholder="Filtrar por origen"
          options={getUniqueOrigins()}
          onChange={handleFilterChange}
          allowClear
        />
        <Input
          onChange={handleSearch}
          placeholder='Buscar por raza'
          suffix={<SearchOutlined />}
        />
      </div>

      <Table
        onRow={(record) => {
          return {
            onClick: () => openCatModal(record),
          };
        }}
        dataSource={filteredCats}
        columns={columns}
        rowKey="id"
      />
      <Modal
        centered
        open={catModal}
        onCancel={closeCatModal}
        footer={null}
        bodyStyle={{ padding: '20px' }}
      >
        {selectedCat && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h2>{selectedCat.name}</h2>
              <p><strong>Origen:</strong> {selectedCat.origin}</p>
              <p><strong>Inteligencia:</strong> {selectedCat.intelligence}</p>
              <p><strong>Descripción:</strong> {selectedCat.description}</p>
              <p><strong>Temperamento:</strong> {selectedCat.temperament}</p>
            </div>
            <div style={{ flexShrink: 0 }}>
              <Image
                src={selectedCat.image?.url}
                alt={selectedCat.name}
                width={150}
                height={150}
                style={{ objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default App;

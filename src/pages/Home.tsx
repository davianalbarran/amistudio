import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import Banner from '../components/Banner/Banner';
import AmiDisplay from '../components/AmiDisplay/AmiDisplay';
import StatsDisplay from '../components/StatsDisplay/StatsDisplay';
import ButtonGroup from '../components/ButtonGroup/ButtonGroup';

interface HomeProps {
  amiData: {
    name: string;
    gender: string;
    spritePath: string;
  };
  stats: {
    str: number;
    end: number;
    int: number;
  };
}

interface AmiData {
    ami_id: number,
    user_id: number,
    name: string,
    gender: string,
    sprite_path: string,
    str_stat: number,
    int_stat: number,
    end_stat: number,
}

const Home: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [amiData, setAmiData] = useState<HomeProps['amiData']>({
    name: '',
    gender: '',
    spritePath: '',
  });
  const [stats, setStats] = useState<HomeProps['stats']>({
    str: 0,
    end: 0,
    int: 0,
  });

  useEffect(() => {
    const checkAmi = async () => {
    const userId = location.state?.userId;
    if (userId) {
        try {
          const amiData: AmiData | null = await invoke('check_ami', { userId });
          if (amiData) {
            setAmiData({
                name: amiData.name,
                gender: amiData.gender,
                spritePath: amiData.sprite_path,
            });
            setStats({
                str: amiData.str_stat,
                end: amiData.end_stat,
                int: amiData.int_stat,
            });
          } else {
            navigate('/AmiCreation', { state: { userId } });
          }
        } catch (error) {
            console.error('Error checking Ami:', error);
        }
}
setIsLoading(false);
};

  checkAmi();
}, [location.state, navigate]);

  const handleShowdowns = () => {
    // Handle showdowns button click
  };

  const handleSettings = () => {
    // Handle settings button click
  };

  const handleAction = (action: string) => {
    // Handle selected action
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Banner />
      <AmiDisplay amiData={amiData} />
      <StatsDisplay stats={stats} />
      <ButtonGroup onShowdowns={handleShowdowns} onSettings={handleSettings} onAction={handleAction} />
    </>
  );
};

export default Home;

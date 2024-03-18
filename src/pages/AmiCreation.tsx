import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/tauri';
import Banner from '../components/Banner/Banner';
import PageHeader from '../components/PageHeader/PageHeader';
import AmiNameInput from '../components/AmiNameInput/AmiNameInput';
import GenderPreference from '../components/GenderPreference/GenderPreference';
import OptionSelector from '../components/OptionSelector/OptionSelector';
import Button from '../components/Button/Button';

const AmiCreation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);
    const [amiName, setAmiName] = useState<string>('');
    const [genderPreference, setGenderPreference] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [spriteOptions, setSpriteOptions] = useState<string[]>([]);

    const handleAmiNameChange = (name: string) => {
        setAmiName(name);
    };

    const handleGenderPreferenceChange = (preference: string) => {
        setGenderPreference(preference);
        updateSpriteOptions(preference);
    };

    const handleOptionSelect = (option: number) => {
        setSelectedOption(option);
    };

    const updateSpriteOptions = (gender: string) => {
        let options: string[] = [];
        if (gender === 'male') {
            options = ['vampire-m-001.png', 'vampire-m-002.png'];
        } else if (gender === 'female') {
            options = ['vampirette-001.png', 'vampirette-002.png'];
        } else if (gender === 'non-binary') {
            options = ['vampire-m-002.png', 'vampirette-002.png'];
        }
        setSpriteOptions(options);
    };

    const handleNext = async () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleFinish = async () => {
        // TODO
        // Handle Ami creation submission
        const userId = location.state?.userId;
        const spritePath = selectedOption !== null ? spriteOptions[selectedOption - 1] : '';

        try {
            await invoke('create_ami', { userId, name: amiName, gender: genderPreference, spritePath });
            // Navigate to the Home page after successful creation
            navigate('/Home', { state: { userId } });
        } catch (error) {
            console.error('Error creating Ami:', error);
            // Handle error state
        }
    }

    const renderStep = () => {
        if (step === 1) {
            return (
                <>
                    <AmiNameInput onNameChange={handleAmiNameChange} />
                    <GenderPreference onPreferenceChange={handleGenderPreferenceChange} />
                    <Button buttonText="Next" onClick={handleNext} />
                </>
                   );
        } else {
            return (
                <>
                    <OptionSelector options={spriteOptions} onOptionSelect={handleOptionSelect} />
                    <Button buttonText="Back" onClick={handleBack} />
                    <Button buttonText="Finish" onClick={handleFinish} />
                </>
                   );
        }
    };

    return (
        <>
            <Banner />
            <PageHeader text="Ami Creation" />
            {renderStep()}
        </>
           );
};

export default AmiCreation;

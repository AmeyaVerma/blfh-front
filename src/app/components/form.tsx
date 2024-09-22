/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/components/ApiForm.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import react-select

export default function ApiForm() {
    const [jsonInput, setJsonInput] = useState('');
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Options for the multiselect dropdown
    const filterOptions = [
        { value: 'Numbers', label: 'Numbers' },
        { value: 'Alphabets', label: 'Alphabets' },
        { value: 'Highest Lowercase Alphabet', label: 'Highest Lowercase Alphabet' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(false);
        try {
            const parsedInput = JSON.parse(jsonInput);
            console.log('Parsed JSON:', parsedInput);

            const res = await axios.post('https://blfh-back.vercel.app/bfhl', parsedInput);

            console.log('Response:', res.data);
            setResponse(res.data);
            setError('');
            setIsSubmitted(true);  // Show dropdown after valid JSON submission
        } catch (err) {
            setError('Invalid JSON or error in API');
            console.error('Error:', err);
        }
    };

    const handleFilterChange = (selected: any) => {
        const filters = selected.map((option: any) => option.value);
        setSelectedFilters(filters);
    };

    const renderFilteredResponse = () => {
        if (!response) return null;

        let filteredResponse: any = {};

        if (selectedFilters.includes('Numbers')) {
            filteredResponse.numbers = response.numbers;
        }

        if (selectedFilters.includes('Alphabets')) {
            filteredResponse.alphabets = response.alphabets;
        }

        if (selectedFilters.includes('Highest Lowercase Alphabet')) {
            filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
        }

        return filteredResponse;
    };

    const filteredResponse = renderFilteredResponse();

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-100 dark:bg-gray-900 rounded-md shadow-lg transition-all duration-500">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">BFHL Challenge</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* JSON Input */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">API Input</label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Input here..."
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {/* Multiselect Filter - Show only after valid JSON submission */}
            {isSubmitted && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Multi Filter</label>
                    <Select
                        isMulti
                        options={filterOptions}
                        onChange={handleFilterChange}
                        className="mt-2"
                        classNamePrefix="select"
                        placeholder="Select filters"
                    />
                </div>
            )}

            {/* Error Handling */}
            {error && <p className="text-red-600 dark:text-red-400 mt-4">{error}</p>}

            {/* Filtered Response */}
            {response && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Filtered Response</h2>
                    <pre className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-gray-200">
                        {filteredResponse && Object.keys(filteredResponse).length > 0 ? (
                            JSON.stringify(filteredResponse, null, 2)
                        ) : (
                            'No data to display. Please select a filter.'
                        )}
                    </pre>
                </div>
            )}
        </div>
    );
}

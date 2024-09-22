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
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-md shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">BFHL Form</h1>
            
            {/* Row Layout for Form Input and Submit Button */}
            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* JSON Input */}
                <div className="col-span-2">
                    <label className="block text-lg font-medium text-gray-700 mb-2">Input</label>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your JSON input here..."
                    />
                </div>

                {/* Submit Button */}
                <div className="col-span-2 flex justify-center">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Submit
                    </button>
                </div>
            </div>

            {/* Multiselect Dropdown - Show only after valid JSON submission */}
            {isSubmitted && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Multi Filter</label>
                    <Select
                        isMulti
                        options={filterOptions}
                        onChange={handleFilterChange}
                        className="w-full"
                        classNamePrefix="select"
                        placeholder="Select filters"
                    />
                </div>
            )}

            {/* Error Handling */}
            {error && <p className="text-red-600 mt-4">{error}</p>}

            {/* Filtered Response */}
            {response && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Response</h2>
                    <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-700 shadow-sm">
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

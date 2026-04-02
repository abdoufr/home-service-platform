import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiDollarSign } from 'react-icons/fi';

const ServiceCard = ({ service }) => {
    const priceLabel = {
        HOUR: '/h',
        FIXED: ' forfait',
        SQMETER: '/m²',
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                {service.image ? (
                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-6xl text-white">🏠</span>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {service.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {service.category_name}
                    </span>
                </div>

                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {service.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <FiMapPin className="mr-1" />
                    <span>{service.city}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">
                            {service.rating > 0 ? service.rating : 'N/A'}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                            ({service.total_reviews} avis)
                        </span>
                    </div>

                    <div className="text-lg font-bold text-blue-600">
                        {service.price} DA
                        <span className="text-xs text-gray-400">
                            {priceLabel[service.price_unit]}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-gray-400">
                        Par {service.provider_name}
                    </span>
                    <Link
                        to={`/services/${service.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                        Voir détails
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ComparisonTable from "@/components/organisms/ComparisonTable";
import PropertyFilters from "@/components/organisms/PropertyFilters";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { propertyService } from "@/services/api/propertyService";

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("newest");
  const [comparisonIds, setComparisonIds] = useState([]);
  const [comparisonProperties, setComparisonProperties] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    loanAmount: 500000,
    downPayment: 100000,
    interestRate: 6.5,
    loanTerm: 30
  });
  const [calculatorResults, setCalculatorResults] = useState(null);
  const navigate = useNavigate();

const calculateMortgage = () => {
    const { loanAmount, downPayment, interestRate, loanTerm } = calculatorData;
    const principal = loanAmount - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (principal <= 0) {
      toast.error("Loan amount must be greater than down payment");
      return;
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - principal;
    
    // Generate amortization schedule for chart
    const schedule = [];
    let remainingBalance = principal;
    
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        yearlyPrincipal += principalPayment;
        yearlyInterest += interestPayment;
        remainingBalance -= principalPayment;
        
        if (remainingBalance <= 0) break;
      }
      
      schedule.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, remainingBalance)
      });
      
      if (remainingBalance <= 0) break;
    }
    
    setCalculatorResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
      principal,
      schedule
    });
    
    toast.success("Mortgage calculation completed successfully");
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await propertyService.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (newFilters) => {
    try {
      setLoading(true);
      setError("");
      const filtered = await propertyService.filter(newFilters);
      setFilteredProperties(filtered);
      setFilters(newFilters);
    } catch (err) {
      setError(err.message || "Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredProperties].sort((a, b) => {
      switch (sortType) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.listingDate) - new Date(a.listingDate);
        case "oldest":
          return new Date(a.listingDate) - new Date(b.listingDate);
        case "sqft-large":
          return b.squareFeet - a.squareFeet;
        case "sqft-small":
          return a.squareFeet - b.squareFeet;
        default:
          return 0;
      }
    });
    setFilteredProperties(sorted);
};

  const handleComparisonToggle = async (propertyId) => {
    if (comparisonIds.includes(propertyId)) {
      // Remove from comparison
      setComparisonIds(prev => prev.filter(id => id !== propertyId));
      setComparisonProperties(prev => prev.filter(p => p.Id !== propertyId));
    } else {
      // Add to comparison (max 4 properties)
      if (comparisonIds.length >= 4) {
        toast.error("You can compare up to 4 properties at a time");
        return;
      }
      
      try {
        const property = await propertyService.getById(propertyId);
        setComparisonIds(prev => [...prev, propertyId]);
        setComparisonProperties(prev => [...prev, property]);
      } catch (error) {
        toast.error("Error adding property to comparison");
      }
    }
  };

  const handleRemoveFromComparison = (propertyId) => {
    setComparisonIds(prev => prev.filter(id => id !== propertyId));
    setComparisonProperties(prev => prev.filter(p => p.Id !== propertyId));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-card p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-3/4">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          Premium Properties
        </h1>
        <p className="text-gray-600">
          Discover your dream home from our curated collection of premium properties
        </p>
      </div>

      {/* Mortgage Calculator Widget */}
      <div className="mb-8 bg-white rounded-lg shadow-card overflow-hidden">
        <div 
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowCalculator(!showCalculator)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-semibold text-primary mb-1">
                Mortgage Calculator
              </h2>
              <p className="text-gray-600 text-sm">
                Calculate your monthly payments and view amortization schedule
              </p>
            </div>
            <ApperIcon 
              name={showCalculator ? "ChevronUp" : "ChevronDown"} 
              className="h-6 w-6 text-gray-400"
            />
          </div>
        </div>
        
        {showCalculator && (
          <div className="border-t border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={calculatorData.loanAmount}
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, loanAmount: Number(e.target.value) }))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="500000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={calculatorData.downPayment}
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="100000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={calculatorData.interestRate}
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="6.5"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={calculatorData.loanTerm}
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, loanTerm: Number(e.target.value) }))}
                    className="w-full pr-12 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="30"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">years</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              <Button onClick={calculateMortgage} className="px-8">
                <ApperIcon name="Calculator" className="h-4 w-4 mr-2" />
                Calculate Mortgage
              </Button>
            </div>
            
            {calculatorResults && (
              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Monthly Payment</h3>
                    <p className="text-2xl font-bold text-primary">
                      ${calculatorResults.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Interest</h3>
                    <p className="text-2xl font-bold text-success">
                      ${calculatorResults.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Total Cost</h3>
                    <p className="text-2xl font-bold text-secondary">
                      ${calculatorResults.totalPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Year</th>
                          <th className="text-right py-2">Principal Paid</th>
                          <th className="text-right py-2">Interest Paid</th>
                          <th className="text-right py-2">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatorResults.schedule.slice(0, 10).map((year, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 font-medium">{year.year}</td>
                            <td className="py-2 text-right">${year.principal.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                            <td className="py-2 text-right">${year.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                            <td className="py-2 text-right">${year.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ComparisonTable 
        properties={comparisonProperties}
        onRemove={handleRemoveFromComparison}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <PropertyFilters
            filters={filters}
            onFiltersChange={setFilters}
            onApplyFilters={applyFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {filteredProperties.length} properties found
              </span>
              {Object.keys(filters).length > 0 && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => applyFilters({})}
                >
                  <ApperIcon name="X" className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="sqft-large">Largest First</option>
                <option value="sqft-small">Smallest First</option>
              </select>
            </div>
          </div>

          {error && (
            <Error message={error} onRetry={loadProperties} />
          )}

          {!error && filteredProperties.length === 0 && (
            <Empty
              title="No properties found"
              description="Try adjusting your search criteria or filters to find more properties."
              actionText="Clear All Filters"
              onAction={() => applyFilters({})}
            />
          )}

          {!error && filteredProperties.length > 0 && (
<PropertyGrid 
              properties={filteredProperties} 
              onComparisonToggle={handleComparisonToggle}
              comparisonIds={comparisonIds}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
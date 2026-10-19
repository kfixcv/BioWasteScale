import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  Activity, 
  PieChart, 
  Trash2, 
  Save,
  AlertCircle,
  FileText,
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // بيانات تجريبية (Demonstration Data)
  const [records, setRecords] = useState([
    { id: 1, date: '2026-10-19', participantId: 'P-001', mealType: 'Lunch', foodName: 'Rice & Chicken', category: 'Grains & Meat', served: 500, leftover: 150 },
    { id: 2, date: '2026-10-19', participantId: 'P-002', mealType: 'Breakfast', foodName: 'Oatmeal', category: 'Grains', served: 300, leftover: 0 },
  ]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    participantId: '',
    mealType: 'Breakfast',
    foodName: '',
    category: 'Vegetables',
    served: '',
    leftover: '',
    reason: '',
    notes: ''
  });

  const [error, setError] = useState('');

  // الحسابات المباشرة للوحة القيادة
  const dashboardStats = useMemo(() => {
    let totalServed = 0;
    let totalLeftover = 0;
    
    records.forEach(record => {
      totalServed += Number(record.served);
      totalLeftover += Number(record.leftover);
    });

    const totalConsumed = totalServed - totalLeftover;
    const wastePercentage = totalServed > 0 ? ((totalLeftover / totalServed) * 100).toFixed(1) : 0;

    return { totalServed, totalConsumed, totalLeftover, wastePercentage, count: records.length };
  }, [records]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSaveRecord = (e) => {
    e.preventDefault();
    const servedNum = Number(formData.served);
    const leftoverNum = Number(formData.leftover);

    if (servedNum <= 0) {
      setError('الكمية المقدمة يجب أن تكون أكبر من الصفر.');
      return;
    }
    if (leftoverNum < 0 || leftoverNum > servedNum) {
      setError('كمية الهدر لا يمكن أن تتجاوز الكمية المقدمة أو تكون سالبة.');
      return;
    }

    const newRecord = {
      ...formData,
      id: Date.now(),
      served: servedNum,
      leftover: leftoverNum
    };

    setRecords(prev => [newRecord, ...prev]);
    setFormData({ ...formData, foodName: '', served: '', leftover: '', reason: '', notes: '' });
  };

  const deleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-teal-900 tracking-tight">Dashboard Overview</h2>
        <span className="bg-teal-50 text-teal-800 text-sm font-medium px-4 py-1.5 rounded-full border border-teal-100 shadow-sm">
          Real-time Metrics
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-800 group-hover:w-2 transition-all duration-300"></div>
          <p className="text-sm font-medium text-gray-500 mb-2">Total Served (g)</p>
          <p className="text-4xl font-bold text-teal-900">{dashboardStats.totalServed}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-800 group-hover:w-2 transition-all duration-300"></div>
          <p className="text-sm font-medium text-gray-500 mb-2">Total Consumed (g)</p>
          <p className="text-4xl font-bold text-blue-900">{dashboardStats.totalConsumed}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 group-hover:w-2 transition-all duration-300"></div>
          <p className="text-sm font-medium text-gray-500 mb-2">Total Wasted (g)</p>
          <p className="text-4xl font-bold text-emerald-600">{dashboardStats.totalLeftover}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-teal-600 group-hover:w-2 transition-all duration-300"></div>
          <p className="text-sm font-medium text-gray-500 mb-2">Waste Percentage</p>
          <p className="text-4xl font-bold text-teal-700">{dashboardStats.wastePercentage}%</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
          <FileText className="text-teal-600" size={24} />
          Recent Records
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 text-sm uppercase tracking-wider border-b">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Participant ID</th>
                <th className="p-4 font-semibold">Meal</th>
                <th className="p-4 font-semibold">Food Item</th>
                <th className="p-4 font-semibold">Waste %</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.map((record, index) => {
                const wastePct = ((record.leftover / record.served) * 100).toFixed(1);
                return (
                  <tr key={record.id} className="hover:bg-teal-50/50 transition-colors duration-200 group">
                    <td className="p-4 text-gray-700">{record.date}</td>
                    <td className="p-4 text-sm font-mono text-gray-500">{record.participantId}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
                        {record.mealType}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{record.foodName}</td>
                    <td className="p-4 font-bold text-emerald-600">{wastePct}%</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => deleteRecord(record.id)} 
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                      <FileText size={32} className="text-gray-400" />
                    </div>
                    <p>No records found. Start adding data.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRecordForm = () => (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-teal-900/5 border border-gray-100 max-w-4xl mx-auto transform transition-all duration-500">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-bold text-teal-900 flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Scale className="text-emerald-600" size={28} />
          </div>
          Record Food Waste
        </h2>
        <p className="text-gray-500 mt-2 ml-14">Enter structured waste records accurately to build the baseline.</p>
      </div>
      
      {error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-center gap-3 animate-pulse">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveRecord} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Participant ID <span className="text-gray-400 font-normal">(Pseudonym)</span></label>
            <input type="text" name="participantId" value={formData.participantId} onChange={handleInputChange} required placeholder="e.g. P-102" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Meal Type</label>
            <select name="mealType" value={formData.mealType} onChange={handleInputChange} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none cursor-pointer">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Food Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none cursor-pointer">
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains & Carbohydrates</option>
              <option>Proteins & Meat</option>
              <option>Dairy</option>
            </select>
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">Food Item Name</label>
            <input type="text" name="foodName" value={formData.foodName} onChange={handleInputChange} required placeholder="e.g. White Rice, Apples" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" />
          </div>
          
          <div className="space-y-2 group">
            <label className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">Served Quantity (grams)</label>
            <input type="number" name="served" value={formData.served} onChange={handleInputChange} required min="1" placeholder="0"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-lg font-mono" />
          </div>
          
          <div className="space-y-2 group">
            <label className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">Leftover Waste (grams)</label>
            <input type="number" name="leftover" value={formData.leftover} onChange={handleInputChange} required min="0" placeholder="0"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-lg font-mono" />
          </div>
          
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-gray-700">Notes / Reason for Waste <span className="text-gray-400 font-normal">(Optional)</span></label>
            <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Portion too large, Didn't like taste" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
          <button type="button" onClick={() => setFormData({...formData, foodName: '', served: '', leftover: ''})} 
            className="px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200">
            Clear Fields
          </button>
          <button type="submit" 
            className="px-8 py-3 flex items-center gap-2 text-white bg-teal-800 hover:bg-teal-900 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-900/30">
            <Save size={20} />
            Save Record
          </button>
        </div>
      </form>
    </div>
  );

  const renderHealthData = () => (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-bold text-teal-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Activity className="text-blue-800" size={28} />
          </div>
          Health & Nutrition Profiles
        </h2>
      </div>
      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        Manage anonymized participant profiles. To protect privacy, never enter names, national IDs, or direct contact information. Data here is linked to waste records via Pseudonymous IDs.
      </p>
      <div className="p-12 border-2 border-dashed border-gray-200 bg-gray-50 rounded-2xl text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group">
        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Activity size={40} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Health Profile Module</h3>
        <p className="text-gray-500">Ready to be connected to the secure backend database.</p>
        <div className="mt-6 inline-block bg-white px-6 py-3 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Required fields: Age Group, BMI Category, Activity Level, Dietary Restrictions
          </p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-5xl mx-auto">
      <div className="mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-bold text-teal-900 flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <PieChart className="text-emerald-600" size={28} />
          </div>
          Analytics & Reports
        </h2>
      </div>
      <p className="text-gray-600 mb-8 leading-relaxed text-lg">
        Explore statistical associations between food waste and health demographics. 
        <span className="block mt-2 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
          Note: Visualizations load based on core calculations of Consumed vs. Leftover metrics.
        </span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="h-72 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-teal-200 hover:shadow-lg transition-all duration-500 group">
          <PieChart size={48} className="mb-4 text-teal-200 group-hover:text-teal-500 transition-colors duration-300 group-hover:scale-110 transform" />
          <span className="font-medium">Waste by Meal Type Chart</span>
          <span className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Loading visualization engine...</span>
        </div>
        <div className="h-72 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-500 group">
          <Activity size={48} className="mb-4 text-blue-200 group-hover:text-blue-500 transition-colors duration-300 group-hover:scale-110 transform" />
          <span className="font-medium">Correlation Analysis Engine</span>
          <span className="text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Awaiting dietary variables...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 font-sans flex flex-col md:flex-row selection:bg-teal-200 selection:text-teal-900">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 shadow-sm flex-shrink-0 flex flex-col z-10">
        <div className="p-8 border-b border-gray-100 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-teal-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-teal-900/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Scale className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-black text-teal-900 tracking-tight text-center">
            BioWaste Scale
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium tracking-widest uppercase">Qassim University</p>
        </div>
        
        <nav className="p-6 space-y-3 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 group ${activeTab === 'dashboard' ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 translate-x-2' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-800'}`}>
            <div className="flex items-center gap-3 font-semibold">
              <LayoutDashboard size={22} className={activeTab === 'dashboard' ? 'text-emerald-400' : 'text-gray-400 group-hover:text-teal-600'} /> 
              Dashboard
            </div>
            {activeTab === 'dashboard' && <ChevronRight size={18} className="text-teal-400" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('record')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 group ${activeTab === 'record' ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 translate-x-2' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-800'}`}>
            <div className="flex items-center gap-3 font-semibold">
              <FileText size={22} className={activeTab === 'record' ? 'text-emerald-400' : 'text-gray-400 group-hover:text-teal-600'} /> 
              Record Waste
            </div>
            {activeTab === 'record' && <ChevronRight size={18} className="text-teal-400" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('health')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 group ${activeTab === 'health' ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 translate-x-2' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-800'}`}>
            <div className="flex items-center gap-3 font-semibold">
              <Activity size={22} className={activeTab === 'health' ? 'text-emerald-400' : 'text-gray-400 group-hover:text-teal-600'} /> 
              Health Data
            </div>
            {activeTab === 'health' && <ChevronRight size={18} className="text-teal-400" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('analytics')} 
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-300 group ${activeTab === 'analytics' ? 'bg-teal-900 text-white shadow-md shadow-teal-900/20 translate-x-2' : 'text-gray-600 hover:bg-teal-50 hover:text-teal-800'}`}>
            <div className="flex items-center gap-3 font-semibold">
              <PieChart size={22} className={activeTab === 'analytics' ? 'text-emerald-400' : 'text-gray-400 group-hover:text-teal-600'} /> 
              Analytics
            </div>
            {activeTab === 'analytics' && <ChevronRight size={18} className="text-teal-400" />}
          </button>
        </nav>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-teal-800 font-bold text-sm">HM</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Haneen Madi</p>
              <p className="text-xs text-emerald-600 font-medium">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'record' && renderRecordForm()}
          {activeTab === 'health' && renderHealthData()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </main>
    </div>
  );
}
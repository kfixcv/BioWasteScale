import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  Activity, 
  PieChart, 
  Trash2, 
  Save,
  AlertCircle,
  FileText
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
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1">Total Served (g)</p>
          <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalServed}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-400">
          <p className="text-sm text-gray-500 mb-1">Total Consumed (g)</p>
          <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalConsumed}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 mb-1">Total Wasted (g)</p>
          <p className="text-3xl font-bold text-gray-800">{dashboardStats.totalLeftover}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-400">
          <p className="text-sm text-gray-500 mb-1">Waste Percentage</p>
          <p className="text-3xl font-bold text-purple-600">{dashboardStats.wastePercentage}%</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b">
                <th className="p-3">Date</th>
                <th className="p-3">ID</th>
                <th className="p-3">Meal</th>
                <th className="p-3">Food</th>
                <th className="p-3">Waste %</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => {
                const wastePct = ((record.leftover / record.served) * 100).toFixed(1);
                return (
                  <tr key={record.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">{record.date}</td>
                    <td className="p-3 text-sm text-gray-500">{record.participantId}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{record.mealType}</span>
                    </td>
                    <td className="p-3">{record.foodName}</td>
                    <td className="p-3 font-medium text-purple-600">{wastePct}%</td>
                    <td className="p-3">
                      <button onClick={() => deleteRecord(record.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {records.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">No records found. Start adding data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRecordForm = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Scale className="text-green-600" />
        Record Food Waste
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSaveRecord} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Participant ID (Pseudonym)</label>
            <input type="text" name="participantId" value={formData.participantId} onChange={handleInputChange} required placeholder="e.g. P-102" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select name="mealType" value={formData.mealType} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains & Carbohydrates</option>
              <option>Proteins & Meat</option>
              <option>Dairy</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Food Item Name</label>
            <input type="text" name="foodName" value={formData.foodName} onChange={handleInputChange} required placeholder="e.g. White Rice, Apples" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Served Quantity (grams)</label>
            <input type="number" name="served" value={formData.served} onChange={handleInputChange} required min="1" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leftover Waste (grams)</label>
            <input type="number" name="leftover" value={formData.leftover} onChange={handleInputChange} required min="0" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Reason for Waste (Optional)</label>
            <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="e.g. Portion too large, Didn't like taste" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => setFormData({...formData, foodName: '', served: '', leftover: ''})} className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Clear
          </button>
          <button type="submit" className="px-5 py-2 flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-sm">
            <Save size={18} />
            Save Record
          </button>
        </div>
      </form>
    </div>
  );

  const renderHealthData = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Activity className="text-purple-600" />
        Health & Nutrition Profiles
      </h2>
      <p className="text-gray-600 mb-6">
        Manage anonymized participant profiles. To protect privacy, never enter names, national IDs, or direct contact information. Data here is linked to waste records via Pseudonymous IDs.
      </p>
      <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500">
        <Activity size={48} className="mx-auto mb-4 text-purple-300" />
        <p>Participant health profile module is ready to be connected to the backend database.</p>
        <p className="text-sm mt-2">Required fields: Age Group, BMI Category, Activity Level, Dietary Restrictions.</p>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <PieChart className="text-green-600" />
        Analytics & Reports
      </h2>
      <p className="text-gray-600 mb-6">
        Explore statistical associations between food waste and health demographics. 
        Note: Associations do not imply causality.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-50 rounded-xl border flex items-center justify-center text-gray-400 flex-col">
          <PieChart size={40} className="mb-2 text-purple-300" />
          <span>Waste by Meal Type Chart Placeholder</span>
        </div>
        <div className="h-64 bg-gray-50 rounded-xl border flex items-center justify-center text-gray-400 flex-col">
          <Activity size={40} className="mb-2 text-green-300" />
          <span>Correlation Analysis Placeholder</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r shadow-sm flex-shrink-0">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-green-700 flex items-center gap-2">
            <Scale className="text-purple-600" />
            BioWaste Scale
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('record')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'record' ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <FileText size={20} /> Record Waste
          </button>
          <button onClick={() => setActiveTab('health')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'health' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Activity size={20} /> Health Data
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <PieChart size={20} /> Analytics
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'record' && renderRecordForm()}
        {activeTab === 'health' && renderHealthData()}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>
    </div>
  );
}
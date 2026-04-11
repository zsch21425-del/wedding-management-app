/* ══════════════════════════════════════════════════════════
 * HIIT Diet & Macro Calculator
 * Calculates daily calorie targets and macro breakdowns
 * based on the Mifflin-St Jeor equation, activity level,
 * and fitness goal.
 * ══════════════════════════════════════════════════════════ */
import React, { useState } from 'react';
import { Flame, Calculator } from 'lucide-react';

interface Results {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function HiitMacroCalculator() {
  const [age, setAge] = useState('44');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightFeet, setHeightFeet] = useState('5');
  const [heightInches, setHeightInches] = useState('7');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [results, setResults] = useState<Results | null>(null);

  const calculate = () => {
    const weightLbs = parseFloat(weight);
    if (!weightLbs || weightLbs <= 0) {
      alert('Please enter a valid weight.');
      return;
    }

    const feet = parseInt(heightFeet) || 0;
    const inches = parseInt(heightInches) || 0;
    const ageNum = parseInt(age) || 0;
    const activityMulti = parseFloat(activity);

    // Conversions
    const weightKg = weightLbs / 2.20462;
    const heightCm = (feet * 12 + inches) * 2.54;

    // Mifflin-St Jeor BMR
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum;
    bmr += gender === 'male' ? 5 : -161;

    // TDEE
    const tdee = bmr * activityMulti;

    // Adjust for goal
    let targetCalories = tdee;
    let pPct: number, cPct: number, fPct: number;

    if (goal === 'lose') {
      targetCalories -= 500;
      pPct = 0.40; cPct = 0.30; fPct = 0.30;
    } else if (goal === 'gain') {
      targetCalories += 300;
      pPct = 0.30; cPct = 0.45; fPct = 0.25;
    } else {
      pPct = 0.30; cPct = 0.40; fPct = 0.30;
    }

    // Prevent dangerously low calories
    if (gender === 'male' && targetCalories < 1500) targetCalories = 1500;
    if (gender === 'female' && targetCalories < 1200) targetCalories = 1200;

    // Calculate macros (Protein & Carbs = 4 cal/g, Fat = 9 cal/g)
    setResults({
      calories: Math.round(targetCalories),
      protein: Math.round((targetCalories * pPct) / 4),
      carbs: Math.round((targetCalories * cPct) / 4),
      fat: Math.round((targetCalories * fPct) / 9),
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <Flame size={20} className="text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">HIIT Nutrition Planner</h1>
          <p className="text-sm text-gray-500">Calculate your daily calorie &amp; macro targets</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              placeholder="Years"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors bg-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Height (Feet)</label>
            <input
              type="number"
              value={heightFeet}
              onChange={e => setHeightFeet(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Height (Inches)</label>
            <input
              type="number"
              value={heightInches}
              onChange={e => setHeightInches(e.target.value)}
              max={11}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weight (lbs)</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="e.g. 180"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
          />
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">HIIT / Activity Level</label>
          <select
            value={activity}
            onChange={e => setActivity(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors bg-white"
          >
            <option value="1.375">Light Activity (1-3 days/week)</option>
            <option value="1.55">Moderate HIIT (3-5 days/week)</option>
            <option value="1.725">Heavy HIIT (6-7 days/week)</option>
          </select>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Goal</label>
          <select
            value={goal}
            onChange={e => setGoal(e.target.value as 'lose' | 'maintain' | 'gain')}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors bg-white"
          >
            <option value="lose">Lose Weight (Fat Loss)</option>
            <option value="maintain">Maintain Current Weight</option>
            <option value="gain">Gain Muscle (Hypertrophy)</option>
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculate}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          <Calculator size={18} />
          Calculate Plan
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="animate-fade-in space-y-4">
          {/* Calorie Target */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <p className="text-sm font-medium text-gray-500 mb-1">Daily Calorie Target</p>
            <p className="text-4xl font-bold text-orange-500">{results.calories.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">kcal / day</p>
          </div>

          {/* Macro Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{results.protein}g</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">PROTEIN</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{results.carbs}g</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">CARBS</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{results.fat}g</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">FATS</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const getDietPlan = (req, res) => {
  const { weight = 70, goal = 'maintain', bodyType = 'mesomorph' } = req.user;

  let calories;
  if (goal === 'lose_fat') calories = weight * 24 - 500;
  else if (goal === 'gain_muscle') calories = weight * 24 + 500;
  else calories = weight * 24;

  const plans = {
    lose_fat: {
      calories: Math.round(calories),
      protein: Math.round(weight * 2),
      meals: {
        breakfast: { name: 'Egg White Omelette + Oats', items: ['4 egg whites omelette with veggies', '1 bowl oats with banana', '1 glass water / green tea'], calories: 350 },
        lunch: { name: 'Dal + Roti + Salad', items: ['2 whole wheat rotis', '1 bowl moong dal', '1 bowl cucumber + tomato salad', '1 glass buttermilk'], calories: 450 },
        snack: { name: 'Fruits + Nuts', items: ['1 apple or banana', '10 almonds', '1 glass water'], calories: 200 },
        dinner: { name: 'Grilled Chicken / Paneer + Sabzi', items: ['150g grilled chicken or 100g paneer', '1 bowl mixed vegetable sabzi', '1 roti', '1 bowl dal'], calories: 400 },
      },
    },
    gain_muscle: {
      calories: Math.round(calories),
      protein: Math.round(weight * 2.2),
      meals: {
        breakfast: { name: 'Eggs + Paratha + Milk', items: ['4 whole eggs (boiled or scrambled)', '2 aloo/paneer parathas with ghee', '1 glass full-fat milk', '1 banana'], calories: 700 },
        lunch: { name: 'Rice + Dal + Chicken/Paneer', items: ['2 cups rice', '1 bowl rajma or chana dal', '200g chicken curry or 150g paneer', '1 bowl curd'], calories: 800 },
        snack: { name: 'Peanut Butter + Bread + Shake', items: ['2 bread slices with peanut butter', '1 banana protein shake (milk + banana + peanut butter)', '10 walnuts'], calories: 450 },
        dinner: { name: 'Roti + Sabzi + Eggs', items: ['3 whole wheat rotis', '1 bowl paneer or chicken sabzi', '2 boiled eggs', '1 bowl dal'], calories: 650 },
      },
    },
    maintain: {
      calories: Math.round(calories),
      protein: Math.round(weight * 1.6),
      meals: {
        breakfast: { name: 'Poha / Upma + Eggs', items: ['1 bowl poha or upma', '2 boiled eggs', '1 glass milk or chai', '1 fruit'], calories: 450 },
        lunch: { name: 'Dal Rice + Sabzi', items: ['1.5 cups rice', '1 bowl dal', '1 bowl seasonal sabzi', '1 bowl curd'], calories: 550 },
        snack: { name: 'Sprouts + Chai', items: ['1 bowl mixed sprouts chaat', '1 cup chai', '2 digestive biscuits'], calories: 250 },
        dinner: { name: 'Roti + Dal + Sabzi', items: ['2 rotis', '1 bowl dal', '1 bowl sabzi', '1 small bowl curd'], calories: 450 },
      },
    },
  };

  res.json(plans[goal] || plans.maintain);
};

const getAllDietPlans = (req, res) => {
  res.json({ goals: ['lose_fat', 'gain_muscle', 'maintain'] });
};

module.exports = { getDietPlan, getAllDietPlans };

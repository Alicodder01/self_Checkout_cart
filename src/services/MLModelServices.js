// src/MLModelService.js
export const fetchMLModelData = async (userId) => {
    const { data, error } = await supabase
      .from('ml_model_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) console.error('Error fetching ML data:', error.message);
    return data ? data[0] : null;
  };
  
  export const saveMLModelData = async (userId, jsonData) => {
    await supabase.from('ml_model_data').insert([{ user_id: userId, data: jsonData }]);
  };
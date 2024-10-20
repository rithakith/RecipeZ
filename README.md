# RecipeZ - Smart Recipe & Meal Planner

RecipeZ is a smart recipe and meal planner app that helps users plan meals based on their dietary preferences, available ingredients, and health goals. The app generates personalized recipe suggestions and provides a seamless meal-planning experience, making healthy eating more accessible and enjoyable.


## Technical Overview of the Architecture

RecipeZ is built using a multi-tier architecture that consists of the following components:

- **Frontend:** Developed with **React Native and Expo using TypeScript**, providing a cross-platform mobile app experience that is both type-safe and robust.
- **Backend:** Powered by **Ballerina**, which manages server-side logic, data processing, and communication with external services. Ballerina is crucial for integrating the Gemini API for AI recommendations and handling database interactions.
- **Recommendation Engine:** Implemented using **Python**, utilizing machine learning techniques to recommend recipes based on user preferences and past interactions.
- **Database:** Uses SQL for storing user data, recipe information, and preferences.
- **AI Integration:** The Gemini API is utilized for AI-powered recipe recommendations based on user inputs.
- **Authentication:** Implemented using **Asgardeo from WSO2** to ensure secure and seamless user login.
- **Dataset:** The recommendation engine uses the [Food.com Recipes and Interactions Dataset](https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions?resource=download&select=RAW_recipes.csv) from Kaggle to power the recipe recommendations.

## Core Features and Functionalities

- **User Authentication:** Secure login using **Asgardeo from WSO2**, ensuring that personal data is protected.
- **Dietary Preferences and Allergies:** Users can specify dietary preferences (e.g., vegetarian, vegan) and allergies (e.g., gluten, nuts).
- **Ingredient Input:** Users can input available ingredients to receive relevant recipe suggestions.
- **Health Goals:** The app offers meal recommendations tailored to specific health goals such as weight loss, muscle gain, or maintaining weight.
- **AI-Powered Recipe Suggestions:** Leverages the Gemini API to provide real-time, personalized recipe recommendations based on the user's dietary needs and available ingredients.
- **Recommendation Engine:** Uses a **Python-based recommendation system** trained on a Kaggle dataset to suggest recipes based on user preferences and past interactions.
- **Recipe Details:** Displays comprehensive information, including ingredients, instructions, cooking time, nutrition, ratings, and reviews.

## Instructions to Execute the Application

1. **Clone the Repositories**
   
   ```bash
   git clone https://github.com/yourusername/RecipeZ.git
   git clone https://github.com/yourusername/RecipeZ_Backend.git

2. **Set Up the Environment**
- **Frontend:** Create a .env file in the RecipeZ root folder and add:
  
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.43.52:8083
   
- **Backend:** In the RecipeZ_Backend folder, add a Config.toml file in the root folder with the following content:

   ```bash
   USER="root"
   PASSWORD="1234567"
   HOST="localhost"
   PORT=3306

- **Recipe Recommender:** In the recipe_recommender folder, create a .env file and add:

   ```bash
   API_KEY=AIzaSyDV7anqM4VSAI7aumG7S3QmeZZxCZZ79mQ
   IPADDRESS=192.168.43.52

3. **Running the Backend (Ballerina)**
- In the root folder of RecipeZ_Backend, execute the Ballerina code:

   ```bash
   bal run

4. **Running the Recipe Recommender**
- In a new terminal, navigate to RecipeZ_Backend and execute:

   ```bash
   python recommender.py

5. **Running the Frontend**
- In the root folder of RecipeZ, install dependencies:

   ```bash
   npm install

- Start the Expo development server:

   ```bash
   npx expo start


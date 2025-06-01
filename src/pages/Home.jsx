import React from 'react';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Get help with everyday tasks</h2>
            <p className="text-xl text-gray-600 mb-8">Thousands of trusted Taskers are ready to help around your home and office</p>
            
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="flex-grow mb-3 md:mb-0 md:mr-2">
                  <input 
                    type="text" 
                    placeholder="I need help with..." 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
                  Post a task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Cleaning', 'Handyman', 'Delivery', 'Furniture Assembly', 'Home Improvement', 'Gardening'].map((category) => (
              <div key={category} className="flex flex-col items-center cursor-pointer group">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-200">
                  <span className="text-blue-600 text-xl">🔧</span>
                </div>
                <span className="text-center text-gray-700 group-hover:text-blue-600">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">How TaskerAir works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Post a task</h4>
              <p className="text-gray-600">Describe what you need help with and when you need it done</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Review offers</h4>
              <p className="text-gray-600">Compare tasker skills, ratings, and prices, then select the best fit</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Get it done!</h4>
              <p className="text-gray-600">Your tasker completes the work and you release payment securely</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-10">What our users say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <h5 className="font-medium">John Doe</h5>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">"TaskerAir made it so easy to find help with my move. Reliable service and great communication!"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of people who use TaskerAir to get more done every day</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100">Post a Task</button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">Become a Tasker</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

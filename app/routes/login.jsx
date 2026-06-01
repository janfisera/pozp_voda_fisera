import { useState, useEffect } from "react";
import { Link } from "react-router";


export default function Login() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="flex-1 flex items-center">
        <h1 className="text-center text-2xl font-bold">Školní záležitosti</h1>
      </div>
      <main className="w-[70%] h-[50vh] flex flex-col justify-center items-center p-8 border border-gray-200 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Přihlášení</h2>
                <form className="space-y-4 w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" required className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Heslo</label>
                        <input type="password" required className="w-full border p-2 rounded-lg focus:border-blue-500 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Přihlásit se</button>
                </form>
            </main>
            <div className="flex-1"></div>
        </div>
  );
}
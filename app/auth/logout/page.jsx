export default function Logout() {
  return (
    <div className="max-w-3xl mx-auto card p-8 mt-16 text-center">
      <h2 className="text-2xl font-semibold">You're signed out</h2>
      <p className="mt-3 text-slate-600">Take care of your spine — stretch, walk and maintain posture.</p>
      <a href="/auth/login" className="inline-block mt-6 px-4 py-2 bg-primary-500 text-white rounded">Sign in again</a>
    </div>
  );
}

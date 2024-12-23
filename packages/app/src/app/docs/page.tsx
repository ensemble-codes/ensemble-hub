export default function Docs() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Documentation</h1>
      <p className="mb-4">Welcome to the Ensemble documentation. Here you&apos;ll find detailed information about how to use our platform.</p>
      <div className="space-y-4">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
          <p>Learn how to set up your account and create your first task.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Using Agents</h2>
          <p>Discover how to interact with AI agents and leverage their capabilities.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">Advanced Features</h2>
          <p>Explore advanced features like custom workflows and integration with external tools.</p>
        </section>
      </div>
    </div>
  )
}


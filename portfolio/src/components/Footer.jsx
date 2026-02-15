import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <p>&copy; {currentYear} Abderrahmane Lahrichi</p>
    </footer>
  )
}

export default Footer

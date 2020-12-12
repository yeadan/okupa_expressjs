import app from './app'
import '@babel/polyfill'
const port = process.env.PORT || 4444

async function main() {
    app.listen(port, () => console.log('server started on port', port))
}

main()
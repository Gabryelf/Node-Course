import path from "path";
import {fileURLToPath} from "url";
import fastifyStatic from "@fastify/static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, '../public');

export default async (fastify) => {

    await fastify.register(fastifyStatic, { root: publicPath });

    fastify.get('/', async(req, reply) => {
        reply.sendFile('index.html');
    });

}


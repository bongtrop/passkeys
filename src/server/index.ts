import { Router } from 'itty-router';
import { Assertion } from './assertion';
import { Attestation } from './attestation';
import * as m from './middleware';
import * as response from './response';
import * as schema from './schema';

const router = Router();

router.post(
    '/attestation/generate',
    m.withContext,
    m.setUserId,
    m.maybeSetSession,
    async (request) => {
        try {
            return await Attestation.generate(request.ctx);
        } catch (err: any) {
            return response.json(
                { error: err?.message },
                undefined,
                err.statusCode
            );
        }
    }
);

router.post(
    '/attestation/store',
    m.withContext,
    m.requiresSession,
    async (request) => {
        try {
            const data =
                (await request.json()) as schema.Attestation.StoreCredentialPayload;
            return await Attestation.storeCredential(request.ctx, data);
        } catch (err: any) {
            return response.json(
                { error: err?.message },
                undefined,
                err.statusCode
            );
        }
    }
);

router.post(
    '/assertion/generate',
    m.withContext,
    m.setUserId,
    m.maybeSetSession,
    async (request) => {
        try {
            return await Assertion.generate(request.ctx);
        } catch (err: any) {
            return response.json(
                { error: err?.message },
                undefined,
                err.statusCode
            );
        }
    }
);

router.post(
    '/assertion/verify',
    m.withContext,
    m.requiresSession,
    async (request) => {
        try {
            const data =
                (await request.json()) as schema.Assertion.VerifyPayload;
            return await Assertion.verifyCredential(request.ctx, data);
        } catch (err: any) {
            return response.json(
                { error: err?.message },
                undefined,
                err.statusCode
            );
        }
    }
);

router.options('*', function handleOptions(request) {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    let headers = request.headers;
    if (
        headers.get('Origin') !== null &&
        headers.get('Access-Control-Request-Method') !== null &&
        headers.get('Access-Control-Request-Headers') !== null
    ) {
        // Handle CORS pre-flight request.
        // If you want to check or reject the requested method + headers
        // you can do that here.
        let respHeaders = {
            ...response.corsHeaders,
            // Allow all future content Request headers to go back to browser
            // such as Authorization (Bearer) or X-Client-Name-Version
            'Access-Control-Allow-Headers': request.headers.get(
                'Access-Control-Request-Headers'
            ),
        };

        return new Response(null, {
            headers: respHeaders,
        });
    } else {
        // Handle standard OPTIONS request.
        // If you want to allow other HTTP Methods, you can do that here.
        return new Response(null, {
            headers: {
                Allow: 'POST, OPTIONS',
            },
        });
    }
});

export default {
    fetch: router.handle,
};

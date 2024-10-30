class CancellablePromise {
    constructor(executor) {
        this.cancelled = false;

        // Create the internal promise
        this.promise = new Promise((resolve, reject) => {
            // Resolve function
            const resolveWrapper = (value) => {
                if (this.cancelled) {
                    reject(new Error('Cancelled'));
                } else {
                    resolve(value);
                }
            };

            // Reject function
            const rejectWrapper = (reason) => {
                reject(reason);
            };

            // Execute the provided executor function
            try {
                executor(resolveWrapper, rejectWrapper);
            } catch (error) {
                reject(error);
            }
        });
    }

    // Method to cancel the promise
    cancel() {
        this.cancelled = true;
    }

    // Method to return the internal promise
    then(onFulfilled, onRejected) {
        return this.promise.then(onFulfilled, onRejected);
    }

    catch(onRejected) {
        return this.promise.catch(onRejected);
    }

    finally(onFinally) {
        return this.promise.finally(onFinally);
    }
}


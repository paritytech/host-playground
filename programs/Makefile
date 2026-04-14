.PHONY: deploy build clean

build:
	forge build

deploy-testnet: build
	@echo "Deploying HostApiDemo to testnet..."
	@OUTPUT=$$(cast send \
		--rpc-url https://eth-rpc-production.up.railway.app \
		--private-key 271ad9a5e1e0178acebdb572f8755aac3463d863ddfc70e32e7d5eb0b334e687 \
		--json \
		--create $$(jq -r '.bytecode.object' out/HostApiDemo.sol/HostApiDemo.json)) && \
	CONTRACT_ADDRESS=$$(echo $$OUTPUT | jq -r '.contractAddress') && \
	echo "HostApiDemo deployed at: $$CONTRACT_ADDRESS" && \
	echo "{\"hostApiDemo\": \"$$CONTRACT_ADDRESS\"}" > deployment.json

clean:
	forge clean

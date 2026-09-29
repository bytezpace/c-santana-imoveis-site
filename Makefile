PORT ?= 8000

.PHONY: start

start:
	@echo "Santana Imóveis rodando em http://localhost:$(PORT)"
	@python3 -m http.server $(PORT)

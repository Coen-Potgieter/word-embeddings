SRC = $(wildcard src/main.cpp)
OBJS = $(SRC:src/%.cpp=bin/%.o)
DEBUG_OBJS = $(SRC:src/%.cpp=bin/debug_%.o)
DEBUG_FLAGS = $(FLAGS) -DDEBUG -g -Wall
INCLUDES = -Iexternal/eigen-3.4.0
FLAGS = -std=c++20 -O2 $(INCLUDES)

build: $(OBJS)
	@echo "Building..."
	@g++ $(FLAGS) $^ -o bin/my_program

run: build
	@echo "Running with args: $(filter-out $@,$(MAKECMDGOALS))\n"
	@bin/my_program $(filter-out $@,$(MAKECMDGOALS))


# Object file rule
bin/%.o: src/%.cpp
	g++ $(FLAGS) -c $< -o $@

# Clean target to remove object files and binaries
clean:
	rm -f bin/*.o bin/my_program

# Debug build
debug: $(DEBUG_OBJS)
	g++ $(DEBUG_FLAGS) $^ -o bin/my_program


# Object files for debug (built with debug flags)
bin/debug_%.o: src/%.cpp
	g++ $(DEBUG_FLAGS) -c $< -o $@

# Prevent Make from trying to build targets called 'XI' etc
%:
	@:

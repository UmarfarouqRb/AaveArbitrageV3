import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const ContractControls = ({ contractAddress }) => {
    return (
        <Box mt={8} p={5} shadow='md' borderWidth='1px'>
            <Text fontSize='xl' mb={4}>Contract Controls</Text>
            {/* <Button onClick={handlePause} isLoading={isLoading} colorScheme='red' mr={4}>
                Pause
            </Button>
            <Button onClick={handleUnpause} isLoading={isLoading} colorScheme='green'>
                Unpause
            </Button> */}
        </Box>
    );
};

export default ContractControls;
